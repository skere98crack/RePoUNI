"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#registro", label: "Registrar problema" },
  { href: "#ranking", label: "Ranking" },
  { href: "#servicios", label: "Categorías" },
  { href: "#equipo", label: "Equipo" },
  { href: "#feedback", label: "Valorar" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-slate-200"
          : "bg-white border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900">RePoUNI</span>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
              UNI · FIIS
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <a href="#registro">Reportar problema</a>
          </Button>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                {l.label}
              </a>
            ))}
            <Button asChild size="sm" className="mt-2">
              <a href="#registro" onClick={() => setOpen(false)}>
                Reportar problema
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
