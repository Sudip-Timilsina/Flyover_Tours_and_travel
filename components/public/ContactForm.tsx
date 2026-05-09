"use client";

import { useState } from "react";
import { contactFormSchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/common/Button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const validation = await contactFormSchema.parseAsync(data);
      
      // Save to database
      const response = await fetch("/api/inquiries/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation),
      });

      if (!response.ok) {
        const body = await response.json();
        setError(formatApiError(body?.error));
        return;
      }

      const whatsappNumber = SITE_CONFIG.phone.replace(/\D/g, "");

      // Send WhatsApp notification to owner
      const ownerMessage = `💬 NEW CONTACT MESSAGE\n\nName: ${validation.name}\nEmail: ${validation.email}\nSubject: ${validation.subject}\n\nMessage: ${validation.message}`;
      const ownerWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(ownerMessage)}`;

      // Send WhatsApp confirmation to user
      const confirmationText = `Hi ${validation.name}, we received your message with subject "${validation.subject}". Our team will contact you at ${validation.email} shortly. Thank you!`;
      const userWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(confirmationText)}`;

      // Open owner notification
      window.open(ownerWhatsappUrl, "_blank", "noopener,noreferrer");
      
      // Open user confirmation
      setTimeout(() => {
        window.open(userWhatsappUrl, "_blank", "noopener,noreferrer");
      }, 500);

      form.reset();
      setSuccess("Message saved! We've sent you a WhatsApp confirmation and notified our team.");
    } catch (submitError: any) {
      setError(formatValidationError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {success && (
        <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            placeholder="What is this about?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            placeholder="Your message..."
          ></textarea>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving & Opening WhatsApp..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
