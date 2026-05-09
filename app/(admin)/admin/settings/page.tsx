"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { Sparkles, LayoutDashboard, Image as ImageIcon, Mail, Phone, MapPin } from "lucide-react";
import { DEFAULT_SITE_SETTINGS, type SiteSettingsValue } from "@/lib/site-settings";

export default function SiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<SiteSettingsValue>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setFormData({
            ...DEFAULT_SITE_SETTINGS,
            ...data,
            logoText: data.logoText || data.siteName || DEFAULT_SITE_SETTINGS.logoText,
            heroImage: (data.heroImage && !data.heroImage.includes("flyover-logo")) ? data.heroImage : "",
          });
        }
      })
      .catch(() => setError("Failed to load site settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Failed to save site settings");
      }

      setSuccess("Site settings saved successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unable to save site settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="glass-card p-8">Loading site settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          <Sparkles className="h-4 w-4" /> Site settings
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Manage homepage, branding, and contact details</h1>
        <p className="max-w-3xl text-slate-600">
          Edit the hero section, replace the homepage photo, and update the site-wide contact details without touching code.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 rounded-3xl border border-white/70 bg-white p-6 shadow-soft md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Brand information</h2>
                <p className="text-sm text-slate-500">Name, site URL, and contact details</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Site Name" name="siteName" value={formData.siteName} onChange={handleChange} />
              <Field label="Logo Text" name="logoText" value={formData.logoText} onChange={handleChange} />
              <Field label="Site URL" name="siteUrl" value={formData.siteUrl} onChange={handleChange} />
              <Field label="Contact Email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
              <Field label="Contact Phone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
              <Field label="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Site Description</label>
              <textarea
                name="siteDescription"
                rows={4}
                value={formData.siteDescription}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/70 bg-slate-950 p-6 text-white shadow-soft md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary-700">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hero section</h2>
                <p className="text-sm text-slate-300">What visitors see first</p>
              </div>
            </div>

            <div className="space-y-4">
              <Field label="Hero Eyebrow" name="heroEyebrow" value={formData.heroEyebrow} onChange={handleChange} dark />
              <Field label="Hero Title" name="heroTitle" value={formData.heroTitle} onChange={handleChange} dark />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Hero Subtitle</label>
                <textarea
                  name="heroSubtitle"
                  rows={5}
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent-300 focus:ring-4 focus:ring-white/10"
                />
              </div>
              <ImageUploadField
                label="Hero Image"
                name="heroImage"
                value={formData.heroImage}
                onChange={(value) => setFormData((prev) => ({ ...prev, heroImage: value }))}
                helperText="Upload an image instead of pasting a URL."
                dark
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Primary CTA Label" name="heroPrimaryCtaLabel" value={formData.heroPrimaryCtaLabel} onChange={handleChange} dark />
                <Field label="Primary CTA Link" name="heroPrimaryCtaHref" value={formData.heroPrimaryCtaHref} onChange={handleChange} dark />
                <Field label="Secondary CTA Label" name="heroSecondaryCtaLabel" value={formData.heroSecondaryCtaLabel} onChange={handleChange} dark />
                <Field label="Secondary CTA Link" name="heroSecondaryCtaHref" value={formData.heroSecondaryCtaHref} onChange={handleChange} dark />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Preview</p>
              <h3 className="mt-3 text-2xl font-black leading-tight">{formData.heroTitle}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{formData.heroSubtitle}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white/10 px-4 py-2">{formData.heroPrimaryCtaLabel}</span>
                <span className="rounded-full bg-white/10 px-4 py-2">{formData.heroSecondaryCtaLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Site Settings"}
          </Button>
          <Button variant="secondary" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  dark = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark?: boolean;
}) {
  return (
    <div>
      <label className={dark ? "mb-2 block text-sm font-semibold text-slate-200" : "mb-2 block text-sm font-semibold text-slate-700"}>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={dark ? "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent-300 focus:ring-4 focus:ring-white/10" : "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"}
      />
    </div>
  );
}