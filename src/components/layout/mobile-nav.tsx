"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";

export function MobileNav() {
  const pathname = usePathname();

  // Show first 4 items or most important items on bottom nav
  const bottomNavItems = navItems.slice(0, 4);

  return (
    <nav 
      className="md:hidden bg-surface/60 backdrop-blur-xl font-label-caps text-label-caps font-display-lg text-primary shadow-[0_0_15px_rgba(34,211,238,0.2)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-[72px] pb-safe border-t border-primary/10"
      style={{ boxShadow: "0 -4px 15px -3px rgba(34,211,238,0.1)" }}
    >
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
              isActive
                ? "text-primary drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] scale-95 opacity-100"
                : "text-outline hover:text-primary-container opacity-80"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] tracking-wider font-bold uppercase">{item.shortTitle}</span>
          </Link>
        );
      })}
    </nav>
  );
}
