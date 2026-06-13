import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/utils/helpers";

interface TourCardProps {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  price: number | string;
  duration: number;
  destination?: string;
  difficulty?: string;
  category?: string;
  badge?: string;
}

export function TourCard({
  id,
  title,
  slug,
  image,
  price,
  duration,
  destination,
  difficulty,
  category,
  badge,
}: TourCardProps) {
  return (
    <Link href={`/tours/${slug}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary-200 group-hover:shadow-[0_26px_70px_-28px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950">
        <div className="relative overflow-hidden">
          {image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white">
              <ShieldCheck className="h-10 w-10 opacity-80" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
            {badge && (
              <span className="rounded-full bg-accent-500 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-accent-500/25">
                {badge}
              </span>
            )}
            {category && (
              <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {category}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 transition group-hover:text-primary-600 dark:text-white">
              {title}
            </h3>
            {destination && (
              <p className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-slate-900 dark:text-primary-300">
                  <MapPin className="h-4 w-4" />
                </span>
                {destination}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300">
                <Clock3 className="h-4 w-4" />
              </span>
              <span className="font-medium">{duration} days</span>
            </div>
            {difficulty && (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/10 text-accent-500 dark:bg-accent-400/10 dark:text-accent-300">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="font-medium">{difficulty}</span>
              </div>
            )}
          </div>

          <p className="line-clamp-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {category ? `${category} journey through Nepal with premium services.` : "Curated travel experience through Nepal's most iconic destinations."}
          </p>

          <div className="mt-auto flex items-end justify-between border-t border-slate-200/80 pt-5 dark:border-slate-800">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">From</p>
              <span className="mt-1 block text-2xl font-black tracking-tight text-primary-700 dark:text-primary-300">
                {formatPrice(price)}
              </span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-primary-600 dark:bg-white dark:text-slate-950">
              View <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
