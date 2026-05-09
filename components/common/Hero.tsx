/**
 * Hero component for pages with background images
 */

import { Mountain } from "lucide-react";
import type { ReactNode } from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-700/75 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,0.25),transparent_28%)]" />

      <div className="container-max relative z-10 flex min-h-[70vh] flex-col justify-center py-24 text-white md:min-h-[82vh]">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
            <Mountain className="h-4 w-4 text-accent-300" />
            Himalayan journeys crafted with care
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-2xl text-lg leading-8 text-slate-100/90 md:text-2xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            {primaryCta}
            {secondaryCta}
          </div>
        </div>
      </div>
    </section>
  );
}
