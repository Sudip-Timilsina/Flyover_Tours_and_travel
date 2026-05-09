"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Route,
  MapPinned,
  PenTool,
  MessageSquareMore,
  LogOut,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/utils/helpers";

async function checkAuth() {
  try {
    const response = await fetch("/api/auth/check");
    const data = await response.json();
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === ROUTES.ADMIN_LOGIN) {
      setIsAuthenticated(true);
      return;
    }

    checkAuth().then((auth) => {
      if (!auth) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-white/70 bg-slate-950 px-5 py-6 text-white shadow-soft lg:block">
          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Admin Studio</p>
              <h1 className="text-xl font-black tracking-tight">Flyover Car Rental</h1>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {[
              { href: ROUTES.ADMIN, label: "Dashboard", icon: LayoutDashboard },
              { href: ROUTES.ADMIN_SETTINGS, label: "Site Settings", icon: Sparkles },
              { href: ROUTES.ADMIN_TOURS, label: "Tours", icon: Route },
              { href: ROUTES.ADMIN_DESTINATIONS, label: "Destinations", icon: MapPinned },
              { href: ROUTES.ADMIN_BLOG, label: "Blog", icon: PenTool },
              { href: ROUTES.ADMIN_INQUIRIES, label: "Inquiries", icon: MessageSquareMore },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/10",
                    "text-slate-300 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-6 h-px bg-white/10" />

            <a
              href="/api/auth/signout"
              className="flex items-center gap-3 rounded-2xl bg-accent-400 px-4 py-3 font-semibold text-white transition hover:bg-accent-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </nav>
        </aside>

        <main className="min-w-0 bg-slate-50">
          <div className="border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur md:px-8 lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Studio</p>
                <h1 className="text-lg font-bold text-slate-900">Flyover Car Rental</h1>
              </div>
              <PanelLeftOpen className="h-5 w-5 text-slate-500" />
            </div>
          </div>
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
