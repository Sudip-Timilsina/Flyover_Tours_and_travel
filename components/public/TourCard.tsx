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
      <article className="glass-card flex h-full flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-glow">
        <div className="relative overflow-hidden">
          {image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-700 to-accent-400 text-white">
              <ShieldCheck className="h-10 w-10 opacity-80" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badge && (
              <span className="rounded-full bg-accent-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-soft">
                {badge}
              </span>
            )}
            {category && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {category}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-primary-600 dark:text-white">
              {title}
            </h3>
            {destination && (
              <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-accent-400" />
                {destination}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
              <Clock3 className="h-4 w-4 text-primary-600" />
              {duration} days
            </div>
            {difficulty && (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900">
                <ShieldCheck className="h-4 w-4 text-accent-400" />
                {difficulty}
              </div>
            )}
          </div>

          <p className="line-clamp-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {category ? `${category} journey through Nepal with premium services.` : "Curated travel experience through Nepal's most iconic destinations."}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-slate-200/80 pt-5 dark:border-slate-800">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">From</p>
              <span className="text-2xl font-black text-primary-600">{formatPrice(price)}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent-400">
              View <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
