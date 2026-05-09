/**
 * New destination page
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/utils/helpers";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";

export default function NewDestinationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await response.json();
      if (response.ok) {
        router.push("/admin/destinations");
      } else {
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
      <h1 className="text-3xl font-bold mb-8">Add New Destination</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Destination Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="e.g., Kathmandu, Pokhara"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Detailed description of the destination"
            ></textarea>
          </div>

          <ImageUploadField
            label="Destination Image"
            name="image"
            value={formData.image}
            onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
            helperText="Upload a hero image for the destination page."
          />

          <div className="flex gap-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Destination"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
