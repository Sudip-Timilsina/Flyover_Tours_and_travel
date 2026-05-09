"use client";

import { useState } from "react";
import { bookingInquirySchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/common/Button";

type TourBookingFormProps = {
  tourId: string;
  tourTitle: string;
};

export function TourBookingForm({ tourId, tourTitle }: TourBookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      adults: (formData.get("adults") as string) || "1",
      children: (formData.get("children") as string) || "0",
      startDate: (formData.get("startDate") as string) || "",
      message: (formData.get("message") as string) || "",
      tourId,
      tourTitle,
    };

    try {
      const validated = await bookingInquirySchema.parseAsync(payload);

      const response = await fetch("/api/inquiries/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const body = await response.json();
      if (!response.ok) {
        setError(formatApiError(body?.error));
        return;
      }

      // Send WhatsApp notification to owner
      const ownerPhoneNumber = SITE_CONFIG.phone.replace(/\D/g, "");
      const startDateFormatted = validated.startDate
        ? new Date(validated.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Not specified";

      const ownerMessage = `🎯 NEW BOOKING REQUEST\n\nTour: ${validated.tourTitle}\nGuest: ${validated.name}\nPhone: ${validated.phone}\nEmail: ${validated.email}\nGuests: ${validated.adults} adult(s), ${validated.children} child(ren)\nStart Date: ${startDateFormatted}\n\nMessage: ${validated.message}`;

      const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(ownerMessage)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      form.reset();
      setSuccess("Thanks! Your booking request has been sent. Our team will contact you shortly.");
    } catch (submitError: any) {
      setError(formatValidationError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-100 space-y-5">
      {success && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 border border-emerald-200">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="name@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="+977-98XXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Preferred Start Date</label>
            <input
              type="date"
              name="startDate"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Adults</label>
            <input
              type="number"
              name="adults"
              min="1"
              defaultValue="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Children</label>
            <input
              type="number"
              name="children"
              min="0"
              defaultValue="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Message</label>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            placeholder="Tell us your travel preferences, special requests, or questions"
          ></textarea>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Send Booking Request"}
        </Button>
      </form>
    </div>
  );
}
