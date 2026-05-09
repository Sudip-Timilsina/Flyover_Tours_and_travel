import { ContactForm } from "@/components/public/ContactForm";
import { generateSEOMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { Mail, MapPinned, Phone, MessageCircle, Clock3, Sparkles } from "lucide-react";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Contact Us",
    description: `Get in touch with ${SITE_CONFIG.name} for bookings and support.`,
  });
}

export default function ContactPage() {
  const whatsappNumber = SITE_CONFIG.phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,0.2),transparent_24%)]" />
        <div className="container-max relative z-10 py-20 md:py-28">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-accent-300" /> Concierged travel support
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Contact our travel specialists.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">Planning something special? We&apos;re here to help craft the perfect Nepal journey.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Contact Info */}
            <div className="glass-card space-y-8 p-8 md:p-10">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
                  <MessageCircle className="h-4 w-4" /> Contact details
                </p>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Get in touch</h2>
              </div>

              <div className="space-y-6 text-slate-600">
                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <Mail className="mt-0.5 h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p>{SITE_CONFIG.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <Phone className="mt-0.5 h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p>{SITE_CONFIG.phone}</p>
                    <p>WhatsApp: {SITE_CONFIG.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <MapPinned className="mt-0.5 h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p>{SITE_CONFIG.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                  <Clock3 className="mt-0.5 h-5 w-5 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <a
                href={whatsappLink}
                className="btn-primary w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8 md:p-10">
              <div className="mb-6 space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
                  <Sparkles className="h-4 w-4" /> Quick inquiry
                </p>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Send us a message</h2>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding pt-0">
        <div className="container-max">
          <div className="glass-card overflow-hidden p-4 md:p-6">
            <h2 className="mb-4 text-center text-3xl font-black tracking-tight text-slate-900">Find us in Pokhara</h2>
            <div className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-slate-200">
              <iframe
                src="https://www.google.com/maps?q=Lakeside-6,Pokhara&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
