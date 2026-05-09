"use client";

import { useEffect, useState } from "react";
import { MessageSquareMore, Mail, Phone, X, CheckCircle, Clock, MessageCircle, ExternalLink } from "lucide-react";

interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
  type: "booking" | "contact";
  tourTitle?: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "booking" | "contact">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryMessage | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === inquiryId ? { ...inq, status: newStatus } : inq
          )
        );
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteInquiry = async (inquiryId: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
        setShowModal(false);
        setSelectedInquiry(null);
      } else {
        alert("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Failed to delete inquiry", error);
      alert("Failed to delete inquiry");
    }
  };

  const contactViaWhatsApp = (inquiry: InquiryMessage) => {
    if (!inquiry.phone) {
      alert("Phone number not available");
      return;
    }
    const phone = inquiry.phone.replace(/\D/g, "");
    const message = `Hi ${inquiry.name}, we received your ${inquiry.type === "booking" ? "booking request for " + (inquiry.tourTitle || "tour") : "message"}. We'll get back to you soon!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const contactViaEmail = (inquiry: InquiryMessage) => {
    const subject = `Re: ${inquiry.type === "booking" ? "Booking Request - " + (inquiry.tourTitle || "Tour") : inquiry.subject || "Your Inquiry"}`;
    const body = `Hello ${inquiry.name},\n\nThank you for reaching out. We received your inquiry and will respond shortly.\n\nBest regards,\nFlyover Car Rental Team`;
    
    // Use Gmail web interface
    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(inquiry.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const filtered = inquiries.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  if (loading) return <div className="glass-card p-8">Loading inquiries...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          <MessageSquareMore className="h-4 w-4" /> Customer conversations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">All Inquiries</h1>
        <p className="max-w-2xl text-slate-600">Track and manage booking requests and contact messages. Click on any inquiry to view details and respond.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All ({inquiries.length})
        </button>
        <button
          onClick={() => setFilter("booking")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filter === "booking"
              ? "bg-primary-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <MessageSquareMore className="h-4 w-4" /> Bookings ({inquiries.filter((i) => i.type === "booking").length})
        </button>
        <button
          onClick={() => setFilter("contact")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filter === "contact"
              ? "bg-primary-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Mail className="h-4 w-4" /> Contact ({inquiries.filter((i) => i.type === "contact").length})
        </button>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((inquiry) => (
            <div
              key={inquiry.id}
              className="glass-card p-6 hover:shadow-md transition cursor-pointer border border-slate-200/50"
              onClick={() => {
                setSelectedInquiry(inquiry);
                setShowModal(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {inquiry.type === "booking" ? (
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Booking
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Contact
                      </span>
                    )}
                    {inquiry.status === "pending" && (
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                    {inquiry.status === "replied" && (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Replied
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{inquiry.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {inquiry.type === "booking" ? `Booking: ${inquiry.tourTitle}` : inquiry.subject}
                  </p>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{inquiry.message}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{inquiry.email}</span>
                {inquiry.phone && (
                  <>
                    <Phone className="h-4 w-4 ml-4" />
                    <span className="text-sm">{inquiry.phone}</span>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <MessageSquareMore className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No inquiries found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between border-b">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {selectedInquiry.type === "booking" ? (
                    <span className="inline-flex rounded-full bg-blue-400 px-3 py-1 text-xs font-semibold">
                      Booking Request
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-400 px-3 py-1 text-xs font-semibold">
                      Contact Message
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{selectedInquiry.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary-600" /> Contact Information
                </h3>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedInquiry.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600">Received</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Inquiry Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">
                  {selectedInquiry.type === "booking" ? "Tour Requested" : "Subject"}
                </h3>
                <p className="text-lg font-bold text-slate-900">
                  {selectedInquiry.type === "booking"
                    ? selectedInquiry.tourTitle
                    : selectedInquiry.subject}
                </p>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Message</h3>
                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Status</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(selectedInquiry.id, "pending")}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      selectedInquiry.status === "pending"
                        ? "bg-amber-600 text-white"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    <Clock className="h-4 w-4" /> Pending
                  </button>
                  <button
                    onClick={() => updateStatus(selectedInquiry.id, "replied")}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      selectedInquiry.status === "replied"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" /> Replied
                  </button>
                  <button
                    onClick={() => updateStatus(selectedInquiry.id, "completed")}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                      selectedInquiry.status === "completed"
                        ? "bg-slate-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" /> Completed
                  </button>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary-600" /> Contact Customer
                </h3>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    onClick={() => contactViaEmail(selectedInquiry)}
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" /> Reply via Email
                  </button>
                  {selectedInquiry.phone && (
                    <button
                      onClick={() => contactViaWhatsApp(selectedInquiry)}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" /> Message via WhatsApp
                    </button>
                  )}
                </div>
              </div>

              {/* Delete Action */}
              <div className="border-t pt-6">
                <button
                  onClick={() => deleteInquiry(selectedInquiry.id)}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" /> Delete This Inquiry
                </button>
                <p className="text-xs text-slate-500 mt-2 text-center">This action cannot be undone</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
