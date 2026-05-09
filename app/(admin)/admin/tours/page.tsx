"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Clock3, Mountain, Pencil, Plus, Trash2 } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  slug: string;
  price: string;
  duration: number;
  published: boolean;
  createdAt: string;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/tours")
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
    setTours(tours.filter((t) => t.id !== id));
  };

  if (loading) return <div className="glass-card p-8">Loading tours...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
            <Mountain className="h-4 w-4" /> Tour management
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Tours</h1>
          <p className="max-w-2xl text-slate-600">Manage packages, pricing, and publication status from a refined admin table.</p>
        </div>
        <Link href="/admin/tours/new" className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Add Tour
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {tours.map((tour) => (
                <tr key={tour.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{tour.title}</p>
                      <p className="text-xs text-slate-500">/{tour.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                      <Clock3 className="h-4 w-4" /> {tour.duration} days
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-sm font-semibold text-accent-700">
                      <BadgeDollarSign className="h-4 w-4" /> NPR {Number(tour.price).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        tour.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tour.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/tours/${tour.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                        <Pencil className="h-4 w-4" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
