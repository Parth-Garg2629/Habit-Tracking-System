import { BarChart3, BookOpen, CalendarCheck, ClipboardList, GitBranch, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  shortTitle: string;
  href: string;
  icon: LucideIcon;
  materialIcon: string;
}

export const navItems: NavItem[] = [
  { title: "DASHBOARD", shortTitle: "DASH", href: "/dashboard", icon: BarChart3, materialIcon: "grid_view" },
  { title: "MISSIONS", shortTitle: "MISS", href: "/daily-log", icon: ClipboardList, materialIcon: "assignment" },
  { title: "CHARACTER", shortTitle: "CHAR", href: "/skills", icon: BookOpen, materialIcon: "person_4" },
  { title: "INVENTORY", shortTitle: "INV", href: "/roadmaps", icon: GitBranch, materialIcon: "inventory_2" },
  { title: "ANALYTICS", shortTitle: "LOG", href: "/weekly-review", icon: CalendarCheck, materialIcon: "monitoring" },
  { title: "SETTINGS", shortTitle: "CFG", href: "/settings", icon: Settings, materialIcon: "settings" }
];
