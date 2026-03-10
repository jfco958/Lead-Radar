"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radar,
  Users,
  TrendingUp,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Métricas y resumen",
  },
  {
    href: "/radar",
    label: "Market Radar",
    icon: Radar,
    description: "Análisis de mercado AI",
    highlight: true,
  },
  {
    href: "/leads",
    label: "Leads",
    icon: Users,
    description: "Gestión de oportunidades",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    icon: TrendingUp,
    description: "Seguimiento comercial",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-btg-navy-light border-r border-btg-navy-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-btg-navy-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <span className="text-btg-navy font-black text-lg">B</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-btg-navy-light" />
          </div>
          <div>
            <div className="font-bold text-btg-text text-sm leading-tight">
              BTG Lead Radar
            </div>
            <div className="text-btg-text-muted text-xs">
              Pactual Colombia
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-btg-text-dim text-xs font-semibold uppercase tracking-wider mb-3 px-2">
          Principal
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                isActive
                  ? "bg-btg-gold/10 text-btg-gold border border-btg-gold/20"
                  : "text-btg-text-muted hover:text-btg-text hover:bg-btg-navy-card"
              )}
            >
              {item.highlight && !isActive && (
                <div className="absolute right-2 top-2 w-2 h-2 bg-btg-gold rounded-full animate-pulse" />
              )}
              <Icon
                size={18}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  isActive ? "text-btg-gold" : "text-current"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{item.label}</div>
                <div className={cn(
                  "text-xs leading-tight mt-0.5 transition-colors",
                  isActive ? "text-btg-gold/70" : "text-btg-text-dim"
                )}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-btg-gold flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Products Quick Reference */}
      <div className="p-4 border-t border-btg-navy-border">
        <div className="text-btg-text-dim text-xs font-semibold uppercase tracking-wider mb-3">
          Productos
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Crédito", color: "bg-blue-500" },
            { label: "Deuda Estructurada", color: "bg-purple-500" },
            { label: "Project Finance", color: "bg-emerald-500" },
            { label: "Garantías", color: "bg-amber-500" },
            { label: "Sit. Especiales", color: "bg-pink-500" },
          ].map((product) => (
            <div
              key={product.label}
              className="flex items-center gap-2 px-2 py-1"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", product.color)} />
              <span className="text-btg-text-muted text-xs">{product.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-btg-navy-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-btg-text-muted hover:text-btg-text hover:bg-btg-navy-card rounded-xl transition-colors"
        >
          <Settings size={16} />
          <span className="text-sm">Configuración</span>
        </Link>
        <div className="mt-3 px-2">
          <div className="text-xs text-btg-text-dim">
            v1.0.0 · BTG Pactual Colombia
          </div>
        </div>
      </div>
    </aside>
  );
}
