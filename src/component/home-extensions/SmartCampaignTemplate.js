"use client";

import Link from "next/link";
import { Armchair, BedDouble, BadgePercent, CalendarClock, ChevronRight, Table2 } from "lucide-react";
import "./SmartCampaignTemplate.css";

const campaignLinks = [
  { label: "Sofas", href: "/sofas", icon: Armchair },
  { label: "Beds", href: "/beds", icon: BedDouble },
  { label: "Dining", href: "/dining-tables", icon: Table2 },
];

export default function SmartCampaignTemplate() {
  return (
    <section className="smart-campaign-section" aria-labelledby="smart-campaign-title">
      <div className="smart-campaign-inner">
        <div className="smart-campaign-shell">
          <div className="smart-campaign-ticket">
            <span className="smart-campaign-ticket-label">Coupon</span>
            <strong>ROYAL2026</strong>
            <small>Extra 20% on selected collections</small>
          </div>

          <div className="smart-campaign-main">
            <span className="smart-campaign-eyebrow">
              <CalendarClock size={16} />
              Smart Campaign
            </span>
            <h2 id="smart-campaign-title">Plan a complete room, unlock a better package price.</h2>
            <div className="smart-campaign-meter" aria-label="Campaign package savings">
              <span style={{ width: "72%" }} />
            </div>
            <div className="smart-campaign-stats">
              <div>
                <strong>3+</strong>
                <span>Items bundle</span>
              </div>
              <div>
                <strong>20%</strong>
                <span>Coupon saving</span>
              </div>
              <div>
                <strong>EMI</strong>
                <span>On request</span>
              </div>
            </div>
          </div>

          <div className="smart-campaign-links" aria-label="Campaign quick links">
            {campaignLinks.map(({ label, href, icon: Icon }) => (
              <Link href={href} className="smart-campaign-chip" key={href}>
                <Icon size={17} />
                {label}
              </Link>
            ))}
            <Link href="/special-offers-all" className="smart-campaign-all">
              All Offers
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="smart-campaign-note">
            <BadgePercent size={17} />
            <span>Best for living room, bedroom and dining room package orders.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
