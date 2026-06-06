"use client";

import React, { useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, FileVideo, ImageUp, ShieldCheck } from "lucide-react";
import { buildApiUrl, CUSTOMER_DATA_ENDPOINTS } from "../../config/api";
import "./ComplaintBoxPage.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  order_number: "",
  product_name: "",
  issue_type: "quality",
  message: "",
  priority: "medium"
};

const issueTypes = [
  { value: "quality", label: "Product quality" },
  { value: "delivery", label: "Delivery issue" },
  { value: "damage", label: "Damaged item" },
  { value: "payment", label: "Payment or refund" },
  { value: "support", label: "Support experience" },
  { value: "general", label: "Other complaint" }
];

export default function ComplaintBoxPage() {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const canSubmit = useMemo(() => (
    form.name.trim() &&
    form.email.trim() &&
    form.message.trim()
  ), [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });
      images.forEach((image) => payload.append("images", image));
      if (video) payload.append("video", video);

      const response = await fetch(buildApiUrl(CUSTOMER_DATA_ENDPOINTS.COMPLAINTS), {
        method: "POST",
        body: payload
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Unable to submit complaint right now.");
      }

      setForm(initialForm);
      setImages([]);
      setVideo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      setStatus({
        type: "success",
        message: "Complaint received. Our support team will review the evidence and contact you soon."
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
    <section className="complaint-box-page">
      <div className="complaint-box-shell">
        <div className="complaint-box-story">
          <span className="complaint-box-kicker">
            <ShieldCheck size={15} />
            Customer Care Desk
          </span>
          <h1>Complaint box for product, delivery, and service issues.</h1>
          <p>
            Send order details, photos, or a short video. We keep every complaint traceable
            so the admin team can review evidence and resolve the issue faster.
          </p>
          <div className="complaint-box-proof">
            <div><strong>01</strong><span>Attach image or video evidence</span></div>
            <div><strong>02</strong><span>Admin team reviews in dashboard</span></div>
            <div><strong>03</strong><span>Status is tracked until resolved</span></div>
          </div>
        </div>

        <form className="complaint-box-card" onSubmit={handleSubmit}>
          <div className="complaint-box-card-head">
            <div className="complaint-box-card-icon">
              <AlertTriangle size={22} />
            </div>
            <div>
              <span>Complaint Box</span>
              <h2>Tell us what happened</h2>
            </div>
          </div>

          <div className="complaint-box-grid">
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
              Order number
              <input name="order_number" value={form.order_number} onChange={handleChange} placeholder="ORD-2026-001" />
            </label>
            <label>
              Product name
              <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="Sofa, bed, wardrobe..." />
            </label>
            <label>
              Issue type
              <select name="issue_type" value={form.issue_type} onChange={handleChange}>
                {issueTypes.map((type) => (
                  <option value={type.value} key={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="complaint-box-wide">
            Complaint details
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Explain the issue, date, delivery condition, product concern, or support problem"
              required
            />
          </label>

          <div className="complaint-upload-grid">
            <label className="complaint-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 5))}
              />
              <ImageUp size={21} />
              <span><strong>Upload images</strong>JPG, PNG, WEBP. Up to 5.</span>
            </label>
            <label className="complaint-upload">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(event) => setVideo(event.target.files?.[0] || null)}
              />
              <FileVideo size={21} />
              <span><strong>Upload video</strong>MP4, MOV, WEBM. One video.</span>
            </label>
          </div>

          {(images.length > 0 || video) && (
            <div className="complaint-files">
              {images.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}
              {video && <span>{video.name}</span>}
            </div>
          )}

          {status.message && (
            <div className={`complaint-box-status ${status.type}`}>
              {status.type === "success" && <CheckCircle2 size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <button className="complaint-box-submit" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Submitting complaint..." : "Submit complaint"}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
