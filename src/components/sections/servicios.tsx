"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIAS_LIST } from "@/components/shared/categorias";
import * as Icons from "lucide-react";

export function Servicios() {
  return (
    <section id="servicios" className="py-20 bg-white border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 mb-3">
            Categorías de clasificación · FIIS
          </span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Tipos de problemas que atendemos
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Cada categoría tiene un peso institucional que influye en la prioridad final. Los
            problemas de seguridad pesan más porque implican riesgo físico para los estudiantes de la FIIS;
            los de integración social pesan menos pero son clave para los cachimbos que recién ingresan a la UNI.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIAS_LIST.map((c) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Tag;
            return (
              <Card
                key={c.key}
                className="border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${c.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wider text-slate-500">Peso</div>
                      <div className="text-2xl font-bold text-slate-900">{c.peso}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{c.label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.descripcion}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                Fórmula de prioridad
              </p>
              <p className="text-sm font-mono text-slate-900">
                P = (Sv × Peso / 10) × 0.40 + Votos × 0.35 + Recencia × 0.25
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Severidad (Sv)</p>
              <p className="text-sm text-slate-700">
                Reportada por el estudiante en escala 1-10 al momento del registro.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Recencia</p>
              <p className="text-sm text-slate-700">
                Decae con el tiempo: un problema pierde prioridad si no recibe nuevos votos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
