"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, MapPinned, MessageSquareMore, ArrowRight, Sparkles } from "lucide-react";

interface Stats {
  totalTours: number;
  totalDestinations: number;
  totalInquiries: number;
  totalBlogPosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="glass-card p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
            <Award className="h-4 w-4" /> Premium dashboard
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Dashboard</h1>
          <p className="max-w-2xl text-slate-600">
            A modern overview of your tours, destinations, blog content, and customer inquiries.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Site Settings",
            value: "CMS",
            icon: Sparkles,
            href: "/admin/settings",
          },
          {
            label: "Total Tours",
            value: stats?.totalTours || 0,
            icon: MapPinned,
            href: "/admin/tours",
          },
          {
            label: "Destinations",
            value: stats?.totalDestinations || 0,
            icon: MessageSquareMore,
            href: "/admin/destinations",
          },
          {
            label: "Blog Posts",
            value: stats?.totalBlogPosts || 0,
            icon: BookOpen,
            href: "/admin/blog",
          },
          {
            label: "Inquiries",
            value: stats?.totalInquiries || 0,
            icon: MessageSquareMore,
            href: "/admin/inquiries",
          },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-slate-900">{card.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <Link
                href={card.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-accent-500"
              >
                Manage {card.label.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
