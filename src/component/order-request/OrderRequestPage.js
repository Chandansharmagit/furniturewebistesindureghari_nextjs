"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Globe2, ImageUp, PackageCheck, Plane, Ship, Sparkles } from "lucide-react";
import { APP_ENDPOINTS, buildApiUrl } from "../../config/api";
import "./OrderRequestPage.css";

const initialForm = {
  request_type: "domestic",
  name: "",
  email: "",
  phone: "",
  furniture_type: "",
  description: "",
  budget: "",
  timeline: "",
  priority: "medium",
  country: "",
  shipping_city: "",
  destination_port: "",
  preferred_shipping: "best_rate",
  company_name: "",
  import_notes: "",
  product_id: "",
  product_sku: "",
  product_quantity: "1",
  product_price: ""
};

const furnitureTypes = [
  "Royal sofa set",
  "Dining room set",
  "Wooden bed",
  "Wardrobe / storage",
  "Study table",
  "Custom staircase",
  "Full room interior",
  "Other handmade furniture"
];

const budgetRanges = [
  "Under Rs. 25,000",
  "Rs. 25,000 - Rs. 50,000",
  "Rs. 50,000 - Rs. 1,00,000",
  "Rs. 1,00,000 - Rs. 2,00,000",
  "Rs. 2,00,000+"
];

const timelines = [
  "1-2 weeks",
  "3-4 weeks",
  "1-2 months",
  "Flexible"
];

const globalShippingOptions = [
  { value: "best_rate", label: "Best freight rate" },
  { value: "air", label: "Air cargo" },
  { value: "sea", label: "Sea cargo / container" },
  { value: "courier", label: "Courier for small items" }
];

export default function OrderRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [references, setReferences] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") !== "international") return;

    const productName = params.get("product") || "";
    const productSku = params.get("sku") || "";
    const quantity = params.get("qty") || "1";
    const productPrice = params.get("price") || "";

    setForm((current) => ({
      ...current,
      request_type: "international",
      priority: "high",
      furniture_type: productName || current.furniture_type,
      product_id: params.get("productId") || current.product_id,
      product_sku: productSku,
      product_quantity: quantity,
      product_price: productPrice,
      description: productName
        ? `International shipment quote for ${productName}${productSku ? ` (SKU ${productSku})` : ""}. Quantity: ${quantity}. Please share packing, freight, document, delivery timeline, and final landed-cost guidance.`
        : current.description
    }));
  }, []);

  const canSubmit = useMemo(() => (
    form.name.trim() &&
    form.email.trim() &&
    form.furniture_type.trim() &&
    form.description.trim() &&
    (form.request_type !== "international" || form.country.trim())
  ), [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleReferenceChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    setReferences(files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type
    })));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(buildApiUrl(APP_ENDPOINTS.ORDER_REQUESTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: references,
          source: form.request_type === "international" ? "international_product_quote" : "order_request_page"
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Unable to submit request right now.");
      }

      setForm(initialForm);
      setReferences([]);
      setStatus({
        type: "success",
        message: "Request received. Our team will review the details and contact you with the next step."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="order-request-page">
      <div className="order-request-shell">
        <div className="order-request-story">
          <span className="order-request-kicker">
            {form.request_type === "international" ? <Globe2 size={15} /> : <Sparkles size={15} />}
            {form.request_type === "international" ? "Global Furniture Export" : "Handmade Custom Furniture"}
          </span>
          <h1>{form.request_type === "international" ? "Buy Sindureghari furniture from anywhere in the world." : "Send your idea. We shape it into a practical furniture plan."}</h1>
          <p>
            {form.request_type === "international"
              ? "Share your destination country and preferred shipping method. Our team will prepare product, packing, freight, invoice, and export-document guidance before confirming the order."
              : "Share your room requirement, preferred wood finish, budget, and timeline. Sindureghari will review it before calling, so the first conversation is useful."}
          </p>

          <div className="order-request-proof">
            <div>
              <strong>01</strong>
              <span>{form.request_type === "international" ? "Product dimensions and export packing checked" : "Design brief reviewed by our furniture team"}</span>
            </div>
            <div>
              <strong>02</strong>
              <span>{form.request_type === "international" ? "Freight route, crate size, and documents estimated" : "Budget and timeline matched before production"}</span>
            </div>
            <div>
              <strong>03</strong>
              <span>{form.request_type === "international" ? "Final quote shared before payment and dispatch" : "Handmade build plan prepared for your space"}</span>
            </div>
          </div>
        </div>

        <form className="order-request-card" onSubmit={handleSubmit}>
          <div className="order-request-mode" role="tablist" aria-label="Order request type">
            <button
              type="button"
              className={form.request_type === "domestic" ? "active" : ""}
              onClick={() => setForm((current) => ({ ...current, request_type: "domestic", priority: "medium" }))}
            >
              Nepal order
            </button>
            <button
              type="button"
              className={form.request_type === "international" ? "active" : ""}
              onClick={() => setForm((current) => ({ ...current, request_type: "international", priority: "high" }))}
            >
              International shipment
            </button>
          </div>

          <div className="order-request-card-head">
            <div className="order-request-card-icon">
              {form.request_type === "international" ? <Plane size={22} /> : <ClipboardList size={22} />}
            </div>
            <div>
              <span>{form.request_type === "international" ? "Export Quote" : "Custom Request"}</span>
              <h2>{form.request_type === "international" ? "Tell us where to ship" : "Tell us what you need"}</h2>
            </div>
          </div>

          {form.request_type === "international" && (
            <div className="global-process-card">
              <div>
                <PackageCheck size={18} />
                <strong>Crate</strong>
                <span>Export-safe packing</span>
              </div>
              <div>
                <Ship size={18} />
                <strong>Ship</strong>
                <span>Air or sea freight</span>
              </div>
              <div>
                <ClipboardList size={18} />
                <strong>Clear</strong>
                <span>Invoice and document help</span>
              </div>
            </div>
          )}

          <div className="order-request-grid">
            <label>
              Full name
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" />
            </label>
            <label>
              Furniture type
              <select name="furniture_type" value={form.furniture_type} onChange={handleChange} required>
                <option value="">Select furniture</option>
                {furnitureTypes.map((type) => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Budget range
              <select name="budget" value={form.budget} onChange={handleChange}>
                <option value="">Select budget</option>
                {budgetRanges.map((range) => (
                  <option value={range} key={range}>{range}</option>
                ))}
              </select>
            </label>
            <label>
              Timeline
              <select name="timeline" value={form.timeline} onChange={handleChange}>
                <option value="">Select timeline</option>
                {timelines.map((timeline) => (
                  <option value={timeline} key={timeline}>{timeline}</option>
                ))}
              </select>
            </label>
          </div>

          {form.request_type === "international" && (
            <div className="order-request-grid global-request-grid">
              <label>
                Destination country
                <input name="country" value={form.country} onChange={handleChange} placeholder="Australia, USA, India..." required />
              </label>
              <label>
                City / delivery area
                <input name="shipping_city" value={form.shipping_city} onChange={handleChange} placeholder="Sydney, Texas, Delhi..." />
              </label>
              <label>
                Nearest port or airport
                <input name="destination_port" value={form.destination_port} onChange={handleChange} placeholder="Optional, if known" />
              </label>
              <label>
                Shipping preference
                <select name="preferred_shipping" value={form.preferred_shipping} onChange={handleChange}>
                  {globalShippingOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Company name
                <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Optional for importers or dealers" />
              </label>
              <label>
                Quantity
                <input name="product_quantity" value={form.product_quantity} onChange={handleChange} placeholder="1" />
              </label>
            </div>
          )}

          <label className="order-request-wide">
            {form.request_type === "international" ? "Shipment and product details" : "Project details"}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={form.request_type === "international" ? "Product name, quantity, destination address, import requirement, and deadline" : "Room size, material preference, finish, storage needs, inspiration, or any special requirement"}
              required
            />
          </label>

          {form.request_type === "international" && (
            <label className="order-request-wide">
              Import notes
              <textarea
                name="import_notes"
                value={form.import_notes}
                onChange={handleChange}
                placeholder="Customs broker details, preferred incoterm, warehouse address, or special packaging requirements"
              />
            </label>
          )}

          <label className="order-request-upload">
            <input type="file" accept="image/*" multiple onChange={handleReferenceChange} />
            <ImageUp size={21} />
            <span>
              <strong>Reference photos</strong>
              JPG, PNG, WEBP. Up to 3 files.
            </span>
          </label>

          {references.length > 0 && (
            <div className="order-request-files">
              {references.map((file) => (
                <span key={`${file.name}-${file.size}`}>{file.name}</span>
              ))}
            </div>
          )}

          {status.message && (
            <div className={`order-request-status ${status.type}`}>
              {status.type === "success" && <CheckCircle2 size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <button className="order-request-submit" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Sending request..." : form.request_type === "international" ? "Request global shipping quote" : "Send order request"}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
