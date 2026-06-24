"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROLES_META } from "@/components/shared/categorias";
import { Loader2, UserCircle2 } from "lucide-react";

type Miembro = {
  id: string;
  nombre: string;
  rol: string;
  orden: number;
};

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

export function Equipo() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setMiembros(data.equipo ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="equipo" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-800 mb-3">
            Equipo del proyecto · FIIS-UNI
          </span>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Quiénes construyen RePoUNI
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Cinco estudiantes de la Facultad de Ingeniería Industrial y de Sistemas (FIIS) de la UNI con roles específicos distribuidos para cubrir todo el ciclo de vida
            del sistema: diseño, base de datos, frontend, clasificación y backend.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {miembros.map((m) => {
              const meta = ROLES_META[m.rol] ?? {
                color: "bg-slate-100 text-slate-700 border-slate-200",
                descripcion: "Responsabilidad del rol.",
              };
              return (
                <Card
                  key={m.id}
                  className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-14 w-14 border-2 border-slate-200">
                        <AvatarFallback className="bg-slate-900 text-white font-semibold">
                          {iniciales(m.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 leading-tight">
                          {m.nombre}
                        </h3>
                        <Badge variant="outline" className={`mt-1 ${meta.color}`}>
                          {m.rol}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{meta.descripcion}</p>
                  </CardContent>
                </Card>
              );
            })}

            {/* Tarjeta extra con info del proyecto */}
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                <UserCircle2 className="h-10 w-10 text-slate-400 mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  ¿Quieres unirte?
                </h3>
                <p className="text-sm text-slate-600">
                  Si eres estudiante y quieres colaborar con el proyecto, contáctanos a través de la
                  sección de valoración con tu sugerencia.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
