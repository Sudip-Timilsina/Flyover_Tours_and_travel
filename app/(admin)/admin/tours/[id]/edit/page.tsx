/**
 * Example admin tour edit page
 * This demonstrates how to edit existing tours
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { createTourSchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { TOUR_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";

export default function EditTourPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    price: "",
    duration: "",
    groupSize: "",
    difficulty: "Moderate",
    category: "Trekking",
    bestSeason: "",
    inclusions: "",
    exclusions: "",
    image: "",
    published: false,
    destinationId: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tourRes, destRes] = await Promise.all([
          fetch(`/api/admin/tours/${params.id}`),
          fetch("/api/admin/destinations")
        ]);
        
        if (!tourRes.ok) throw new Error("Failed to load tour");
        const tourData = await tourRes.json();
        
        if (destRes.ok) {
          const destData = await destRes.json();
          if (mounted) setDestinations(destData);
        }
        
        if (!mounted) return;
        setFormData({
          title: tourData.title || "",
          description: tourData.description || "",
          overview: tourData.overview || "",
          price: String(tourData.price ?? ""),
          duration: String(tourData.duration ?? ""),
          groupSize: tourData.groupSize || "",
          difficulty: tourData.difficulty || "Moderate",
          category: tourData.category || "Trekking",
          bestSeason: tourData.bestSeason || "",
          inclusions: Array.isArray(tourData.inclusions) ? tourData.inclusions.join(", ") : "",
          exclusions: Array.isArray(tourData.exclusions) ? tourData.exclusions.join(", ") : "",
          image: tourData.image || "",
          published: tourData.published || false,
          destinationId: tourData.destinationId || "",
          seoTitle: tourData.seoTitle || "",
          seoDescription: tourData.seoDescription || "",
          keywords: tourData.keywords || "",
        });
      } catch (fetchError: any) {
        setError(formatApiError(fetchError.message) || "Failed to load tour");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target as any;
    const isCheckbox = type === "checkbox";
    setFormData((previous) => ({ ...previous, [name]: isCheckbox ? (event.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validated = await createTourSchema.parseAsync(formData);
      const response = await fetch(`/api/admin/tours/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (response.ok) {
        router.push("/admin/tours");
      } else {
        const payload = await response.json();
        setError(formatApiError(payload?.error) || "Failed to update tour");
      }
    } catch (submitError: any) {
      setError(formatValidationError(submitError));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tours/${params.id}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/admin/tours");
      } else {
        const payload = await response.json();
        setError(payload?.error || "Failed to delete tour");
      }
    } catch (deleteError: any) {
      setError(deleteError.message || "Failed to delete tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Tour</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Enter tour title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Short description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Overview *</label>
            <textarea
              name="overview"
              required
              rows={4}
              value={formData.overview}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Detailed overview"
            ></textarea>
          </div>

          <ImageUploadField
            label="Tour Image"
            name="image"
            value={formData.image}
            onChange={(value) => setFormData((previous) => ({ ...previous, image: value }))}
            helperText="Upload the main image used on the tour card and detail page."
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Price (NPR) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Duration (days) *</label>
              <input
                type="number"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Group Size *</label>
              <input
                type="text"
                name="groupSize"
                required
                value={formData.groupSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
                placeholder="e.g., 4-8 people"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Difficulty *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              >
                {TOUR_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Best Season *</label>
              <input
                type="text"
                name="bestSeason"
                required
                value={formData.bestSeason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
                placeholder="e.g., Oct-Nov"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Inclusions</label>
            <textarea
              name="inclusions"
              rows={3}
              value={formData.inclusions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="List items separated by commas or newlines"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Exclusions</label>
            <textarea
              name="exclusions"
              rows={3}
              value={formData.exclusions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="List items separated by commas or newlines"
            ></textarea>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold mb-2">Destination</label>
            <select
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
            >
              <option value="">-- Select Destination --</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEO Fields */}
          <div>
            <label className="block text-sm font-semibold mb-2">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Search engine title (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">SEO Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              value={formData.seoDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Search engine description (optional)"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Comma-separated keywords (optional)"
            />
          </div>

          {/* Published Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Published</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">Uncheck to save as draft</p>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Tour"}
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
