"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ClipboardList, BarChart3, Users, ShieldCheck } from "lucide-react";

type Stats = {
  total: number;
  abiertos: number;
  enProgreso: number;
  resueltos: number;
  totalVotos: number;
  totalValoraciones: number;
  promedioPrioridad: number;
};

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Registro estructurado",
    desc: "Cada estudiante reporta problemas clasificados por tipo: infraestructura, social, estudiantil, académico, seguridad u otros.",
  },
  {
    icon: BarChart3,
    title: "Priorización automática",
    desc: "Un algoritmo pondera severidad, frecuencia y recencia para identificar el problema más latente por resolver.",
  },
  {
    icon: Users,
    title: "Apoyo a cachimbos",
    desc: "Diseñado pensando en estudiantes nuevos que necesitan orientación para enfrentar la vida universitaria.",
  },
  {
    icon: ShieldCheck,
    title: "Trazabilidad del estado",
    desc: "Cada problema pasa de abierto → en progreso → resuelto, con valoraciones y sugerencias de la comunidad.",
  },
];

export function Hero({ stats }: { stats: Stats | null }) {
  return (
    <section id="top" className="relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(139,26,26,0.10) 0%, rgba(139,26,26,0) 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-800 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Universidad Nacional de Ingeniería · FIIS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              Sistema de registro de <span className="text-primary">problemas universitarios</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Plataforma para que los estudiantes de la <strong className="text-slate-900">Facultad de Ingeniería Industrial y de Sistemas (FIIS)</strong> de la UNI reporten, clasifiquen y prioricen problemas. Apoya especialmente a los cachimbos, quienes con mayor frecuencia enfrentan inconvenientes que no saben cómo resolver por sí solos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <a href="#registro">
                  Registrar un problema
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#ranking">Ver ranking de prioridad</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              {stats
                ? `${stats.total} problemas reportados · ${stats.totalVotos} votos acumulados · ${stats.totalValoraciones} valoraciones de la comunidad`
                : "Cargando estadísticas..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Problemas reportados" value={stats?.total ?? 0} sub="Total acumulado" />
            <StatCard
              label="Prioridad promedio"
              value={stats ? stats.promedioPrioridad.toFixed(1) : "—"}
              sub="Sobre 10.0"
              highlight
            />
            <StatCard label="Votos acumulados" value={stats?.totalVotos ?? 0} sub="Estudiantes afectados" />
            <StatCard label="Valoraciones" value={stats?.totalValoraciones ?? 0} sub="Comunidad activa" />
          </div>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: number | string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`border shadow-sm ${
        highlight ? "bg-primary text-white border-primary" : "bg-card border-border"
      }`}
    >
      <CardContent className="p-5">
        <p className={`text-xs uppercase tracking-wider ${highlight ? "text-red-50" : "text-muted-foreground"}`}>
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        <p className={`mt-1 text-xs ${highlight ? "text-red-100" : "text-muted-foreground"}`}>{sub}</p>
      </CardContent>
    </Card>
  );
}
