/**
 * Destination edit page template
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";

export default function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/destinations/${params.id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (mounted) setFormData({ name: data.name || "", description: data.description || "", image: data.image || "" });
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { mounted = false };
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const body = await response.json();
      if (response.ok) {
        router.push("/admin/destinations");
      } else {
        setError(formatApiError(body?.error));
      }
    } catch (error: any) {
      setError(formatValidationError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/destinations/${params.id}`, { method: "DELETE" });
      const body = await res.json();
      if (res.ok) router.push("/admin/destinations");
      else {
        setError(formatApiError(body?.error));
      }
    } catch (err: any) {
      setError(formatValidationError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Destination</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Destination Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="e.g., Kathmandu, Pokhara"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Detailed description of the destination"
            ></textarea>
          </div>

          <ImageUploadField
            label="Destination Image"
            name="image"
            value={formData.image}
            onChange={(value) => setFormData((p) => ({ ...p, image: value }))}
            helperText="Upload a hero image for the destination page."
          />

          <div className="flex gap-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button variant="danger" type="button" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
