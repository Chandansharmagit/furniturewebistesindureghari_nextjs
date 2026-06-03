"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ImagePlus, Loader2, MapPin, Phone, UploadCloud, X } from "lucide-react";
import { buildApiUrl, CUSTOMER_DATA_ENDPOINTS } from "../../config/api";
import "./DesignConsultationTemplates.css";

const templates = [
  {
    id: "modern-kitchen",
    eyebrow: "Modern Kitchen",
    title: "Looking for a new kitchen?",
    cta: "Book a consultation",
    location: "Modern layouts for compact and premium homes",
    image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    accent: "#1f4f8f"
  },
  {
    id: "modular-kitchen",
    eyebrow: "Modular Kitchen",
    title: "Need a smart modular setup?",
    cta: "Book a consultation",
    location: "Storage-led planning with clean finishes",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    accent: "#815f46"
  },
  {
    id: "wooden-staircase",
    eyebrow: "Wooden Staircase",
    title: "Planning a statement staircase?",
    cta: "Book a consultation",
    location: "Solid wood detailing for homes and villas",
    image: "https://images.unsplash.com/photo-1713184359231-832519897def?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    accent: "#6b3f22"
  }
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  budget: "",
  message: ""
};

export default function DesignConsultationTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplate) || templates[0],
    [selectedTemplate]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []).slice(0, 5);
    setFiles(selectedFiles);
  };

  const openConsultationForm = (templateId) => {
    setSelectedTemplate(templateId);
    setStatus({ type: "", message: "" });
    setIsFormOpen(true);
  };

  const closeConsultationForm = () => {
    if (!submitting) {
      setIsFormOpen(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = new FormData();
      payload.append("template_type", activeTemplate.eyebrow);
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      files.forEach((file) => payload.append("images", file));

      const response = await fetch(buildApiUrl(CUSTOMER_DATA_ENDPOINTS.CONSULTATION_REQUESTS), {
        method: "POST",
        body: payload
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your request right now");
      }

      setFormData(initialForm);
      setFiles([]);
      setStatus({
        type: "success",
        message: "Request sent. Our design team will contact you shortly."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="design-template-section" aria-labelledby="design-template-title">
      <div className="design-template-inner">
        <div className="design-template-heading">
          <span>Design consultations</span>
          <h2 id="design-template-title">Choose your design template.</h2>
          <p>Pick a kitchen or staircase concept, then send your room photos and measurements. Our team will review it and call you with a practical plan.</p>
        </div>

        <div className="design-template-layout">
          <div className="design-template-cards" aria-label="Consultation templates">
            {templates.map((template) => (
              <article
                className={`design-template-card ${selectedTemplate === template.id ? "active" : ""}`}
                key={template.id}
                style={{ "--template-accent": template.accent, backgroundImage: `url(${template.image})` }}
              >
                <span className="design-template-card-shade" />
                <span className="design-template-card-panel">
                  <strong>{template.eyebrow}</strong>
                  <span>{template.title}</span>
                  <small><MapPin size={14} /> {template.location}</small>
                  <button type="button" onClick={() => openConsultationForm(template.id)}>
                    {template.cta}
                    <ArrowRight size={16} />
                  </button>
                </span>
              </article>
            ))}

          </div>

          {isFormOpen && (
            <div className="design-template-modal" role="dialog" aria-modal="true" aria-label="Consultation request form">
              <button className="design-template-modal-backdrop" type="button" onClick={closeConsultationForm} aria-label="Close consultation form" />
              <form className="design-template-form" onSubmit={handleSubmit}>
                <div className="design-template-form-top">
                  <span style={{ backgroundColor: activeTemplate.accent }}>
                    <ImagePlus size={18} />
                  </span>
                  <div>
                    <strong>{activeTemplate.eyebrow}</strong>
                    <small>{activeTemplate.cta}</small>
                  </div>
                  <button className="design-template-close" type="button" onClick={closeConsultationForm} aria-label="Close form">
                    <X size={18} />
                  </button>
                </div>

                <div className="design-template-fields">
                  <label>
                    Full name
                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required />
                  </label>
                  <label>
                    Phone number
                    <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="98XXXXXXXX" required />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" />
                  </label>
                  <label>
                    City
                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Kathmandu, Pokhara..." />
                  </label>
                  <label>
                    Budget range
                    <select name="budget" value={formData.budget} onChange={handleInputChange}>
                      <option value="">Select budget</option>
                      <option value="Under NPR 100,000">Under NPR 100,000</option>
                      <option value="NPR 100,000 - 300,000">NPR 100,000 - 300,000</option>
                      <option value="NPR 300,000 - 700,000">NPR 300,000 - 700,000</option>
                      <option value="NPR 700,000+">NPR 700,000+</option>
                    </select>
                  </label>
                  <label className="wide">
                    Project details
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="3" placeholder="Room size, preferred finish, timeline, or any special requirement" />
                  </label>
                </div>

                <label className="design-template-upload">
                  <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
                  <UploadCloud size={22} />
                  <span>{files.length ? `${files.length} image${files.length > 1 ? "s" : ""} ready` : "Upload room/reference images"}</span>
                  <small>JPG, PNG, WEBP. Up to 5 images.</small>
                </label>

                {status.message && (
                  <div className={`design-template-status ${status.type}`}>
                    {status.type === "success" ? <CheckCircle2 size={18} /> : <Phone size={18} />}
                    {status.message}
                  </div>
                )}

                <button className="design-template-submit" type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
                  {submitting ? "Sending request" : "Send consultation request"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
