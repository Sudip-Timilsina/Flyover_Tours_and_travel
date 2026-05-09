"use client";

import { motion } from "framer-motion";

export function Loading({ label = "Loading experience..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-600">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        className="mb-4 h-14 w-14 rounded-full border-4 border-primary-100 border-t-primary-600"
      />
      <p className="text-sm font-medium tracking-wide">{label}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-soft">
      {message}
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export function TourCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden p-4">
      <LoadingSkeleton className="h-56 w-full" />
      <div className="space-y-3 p-5">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <LoadingSkeleton className="h-5 w-20" />
          <LoadingSkeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
