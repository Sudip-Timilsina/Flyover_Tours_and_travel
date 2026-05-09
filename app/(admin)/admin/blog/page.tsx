"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Pencil, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/common/Button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const response = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (response.ok) {
      setPosts((current) => current.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
            <BookOpen className="h-4 w-4" /> Story management
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Blog Posts</h1>
          <p className="max-w-2xl text-slate-600">Compose and manage editorial content with a tidy, content-led table.</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary w-fit">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="glass-card p-8">Loading blog posts...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {posts.map((post) => (
                  <tr key={post.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-5">
                      {post.image ? (
                        <div className="relative h-14 w-20 overflow-hidden rounded-xl bg-slate-100">
                          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="80px" />
                        </div>
                      ) : (
                        <div className="inline-flex h-14 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-900">{post.title}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100">
                          <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <Button variant="danger" size="sm" type="button" onClick={() => handleDelete(post.id)}>
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
