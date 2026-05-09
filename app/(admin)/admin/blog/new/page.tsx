"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPostSchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    published: false,
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const validated = await createBlogPostSchema.parseAsync(formData);

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const body = await response.json();
      if (response.ok) {
        router.push("/admin/blog");
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
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Blog post title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              required
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Short summary of the post"
            ></textarea>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Content *
            </label>
            <textarea
              name="content"
              required
              rows={10}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600 font-mono text-sm"
              placeholder="Detailed blog post content"
            ></textarea>
          </div>

          <ImageUploadField
            label="Blog Image"
            name="image"
            value={formData.image}
            onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
            helperText="Upload a featured image for the blog card and article page."
          />

          {/* Published */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Blog Post"}
            </Button>
            <Button variant="secondary" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
