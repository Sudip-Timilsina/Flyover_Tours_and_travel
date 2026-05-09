/**
 * Blog edit page template
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatValidationError, formatApiError } from "@/lib/error-messages";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { createBlogPostSchema } from "@/lib/validations";

export default function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", excerpt: "", content: "", published: false, image: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/blog/${params.id}`);
        if (!res.ok) throw new Error("Failed to load blog post");
        const data = await res.json();
        if (mounted) setFormData({ title: data.title || "", excerpt: data.excerpt || "", content: data.content || "", published: !!data.published, image: data.image || "" });
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
      const validated = await createBlogPostSchema.parseAsync(formData);
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      const body = await response.json();
      if (response.ok) router.push("/admin/blog");
      else {
        setError(formatApiError(body?.error));
      }
    } catch (err: any) {
      setError(formatValidationError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${params.id}`, { method: "DELETE" });
      const body = await res.json();
      if (res.ok) router.push("/admin/blog");
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
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Blog post title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600"
              placeholder="Short summary of the post"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Content *</label>
            <textarea
              name="content"
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-nepal-600 font-mono text-sm"
              placeholder="Detailed blog post content"
            ></textarea>
          </div>

          <ImageUploadField
            label="Blog Image"
            name="image"
            value={formData.image}
            onChange={(value) => setFormData((p) => ({ ...p, image: value }))}
            helperText="Upload a featured image for the blog card and article page."
          />

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="font-semibold">Publish immediately</span>
            </label>
          </div>

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
