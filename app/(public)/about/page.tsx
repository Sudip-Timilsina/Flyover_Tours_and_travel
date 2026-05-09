import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export const metadata = generateSEOMetadata({
  title: "About Flyover Car Rental",
  description: "Learn more about Flyover Car Rental and our services",
});

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-nepal-600 to-nepal-700 text-white py-20">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg opacity-90">{SITE_CONFIG.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="space-y-12">
            {/* Contact Section */}
            <div className="rounded-lg bg-slate-50 p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-nepal-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Phone</p>
                    <p className="text-slate-600">{SITE_CONFIG.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-nepal-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-600">{SITE_CONFIG.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-nepal-600 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Address</p>
                    <p className="text-slate-600">{SITE_CONFIG.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-slate-600 mb-6">Ready to book your adventure?</p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-nepal-600 text-white rounded-lg font-semibold hover:bg-nepal-700 transition">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
