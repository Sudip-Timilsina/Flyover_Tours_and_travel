export default function Loading() {
  return (
    <div className="page-shell">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950" />
        <div className="container-max relative z-10 grid min-h-[82vh] items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl space-y-8">
            <div className="h-10 w-56 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-4">
              <div className="h-16 w-full max-w-2xl animate-pulse rounded-3xl bg-white/10" />
              <div className="h-8 w-full max-w-xl animate-pulse rounded-3xl bg-white/10" />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-14 w-44 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-14 w-36 animate-pulse rounded-2xl bg-white/10" />
            </div>
          </div>

          <div className="glass-card overflow-hidden p-4">
            <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-white/10" />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max space-y-8">
          <div className="h-12 w-72 animate-pulse rounded-2xl bg-slate-200/80" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-card overflow-hidden p-4">
                <div className="h-56 w-full animate-pulse rounded-2xl bg-slate-200/80" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200/80" />
                  <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200/80" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/80" />
                  <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200/80" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200/80" />
                    <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200/80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
