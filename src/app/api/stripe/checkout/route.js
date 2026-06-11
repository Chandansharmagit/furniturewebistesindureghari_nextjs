import { NextResponse } from "next/server";

const STRIPE_CHECKOUT_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions";

const getOrigin = (request) => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return request.nextUrl.origin;
};

const normalizeAmount = (value) => {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.round(numeric * 100);
};

const appendLineItem = (params, item, index) => {
  const name = String(item.title || item.name || "Sindureghari Furniture item").slice(0, 120);
  const quantity = Math.max(1, Number.parseInt(item.quantity || 1, 10));
  const unitAmount = normalizeAmount(item.price);

  if (!unitAmount) return false;

  params.append(`line_items[${index}][quantity]`, String(quantity));
  params.append(`line_items[${index}][price_data][currency]`, process.env.STRIPE_CURRENCY || "npr");
  params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmount));
  params.append(`line_items[${index}][price_data][product_data][name]`, name);

  if (item.image && String(item.image).startsWith("https://")) {
    params.append(`line_items[${index}][price_data][product_data][images][0]`, item.image);
  }

  return true;
};

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const cartItems = Array.isArray(payload.items) ? payload.items : [];
  if (!cartItems.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const origin = getOrigin(request);
  const params = new URLSearchParams();

  params.append("mode", "payment");
  params.append("success_url", `${origin}/orders?stripe=success&session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${origin}/checkout?stripe=cancelled`);
  params.append("billing_address_collection", "auto");
  params.append("phone_number_collection[enabled]", "true");
  params.append("metadata[source]", "Sindureghari Furniture checkout");
  params.append("metadata[customer_email]", String(payload.customer?.email || "").slice(0, 250));
  params.append("metadata[customer_phone]", String(payload.customer?.phone || "").slice(0, 120));
  params.append("metadata[shipping_city]", String(payload.shipping?.city || "").slice(0, 120));
  params.append("metadata[cart_total]", String(payload.total || ""));

  let stripeIndex = 0;
  cartItems.forEach((item) => {
    if (appendLineItem(params, item, stripeIndex)) {
      stripeIndex += 1;
    }
  });

  if (!stripeIndex) {
    return NextResponse.json({ error: "Cart total must be greater than zero." }, { status: 400 });
  }

  const response = await fetch(STRIPE_CHECKOUT_SESSIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const session = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: session.error?.message || "Stripe checkout session failed." },
      { status: response.status }
    );
  }

  return NextResponse.json({ url: session.url });
}
