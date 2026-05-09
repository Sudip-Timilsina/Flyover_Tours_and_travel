"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPinned, Pencil, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/common/Button";

interface Destination {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: string;
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/destinations")
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this destination?")) return;
    const response = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (response.ok) {
      setDestinations((current) => current.filter((destination) => destination.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
            <MapPinned className="h-4 w-4" /> Destination library
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Destinations</h1>
          <p className="max-w-2xl text-slate-600">Organize destination pages with a polished, content-first admin view.</p>
        </div>
        <Link href="/admin/destinations/new" className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> Add Destination
        </Link>
      </div>

      {loading ? (
        <div className="glass-card p-8">Loading destinations...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-5">
                      {dest.image ? (
                        <div className="relative h-14 w-20 overflow-hidden rounded-xl bg-slate-100">
                          <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="80px" />
                        </div>
                      ) : (
                        <div className="inline-flex h-14 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-900">{dest.name}</td>
                    <td className="px-6 py-5 text-slate-600">{dest.slug}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">{new Date(dest.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/destinations/${dest.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                          <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <Button variant="danger" size="sm" type="button" onClick={() => handleDelete(dest.id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
