import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { LayoutWrapper } from "@/components/common/LayoutWrapper";
import "./globals.css";

const baseMetadata = generateSEOMetadata({
  title: "Flyover Car Rental - Premium Car Rental Service",
  description:
    "Flyover Car Rental provides reliable and premium car rental service in Pokhara with quick WhatsApp support.",
  keywords:
    "Flyover Car Rental, Pokhara car rental, Nepal car hire",
});

export const metadata: Metadata = {
  ...baseMetadata,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/uploads/flyover-logo.jpg" />
        <link rel="apple-touch-icon" href="/uploads/flyover-logo.jpg" />
        <meta name="theme-color" content="#0B3C5D" />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}