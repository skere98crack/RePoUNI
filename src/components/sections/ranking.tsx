"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  CATEGORIAS_LIST,
  getCategoria,
  nivelPrioridad,
  NIVELES_PRIORIDAD,
} from "@/components/shared/categorias";
import {
  Flame,
  MapPin,
  Users,
  Calendar,
  Loader2,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

type Problema = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: string | null;
  severidad: number;
  estado: string;
  prioridad: number;
  votos: number;
  createdAt: string;
  _count?: { valoraciones: number };
};

type FiltroCategoria = string;
type FiltroOrden = "prioridad" | "recientes" | "votos";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
  return `Hace ${Math.floor(days / 30)} mes`;
}

export function Ranking() {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState<FiltroCategoria>("todas");
  const [orden, setOrden] = useState<FiltroOrden>("prioridad");

  const cargar = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ categoria, orden });
    const res = await fetch(`/api/problems?${params}`);
    const data = await res.json();
    setProblemas(data.problemas ?? []);
    setLoading(false);
  }, [categoria, orden]);

  useEffect(() => {
    // Carga inicial + recarga cuando cambian los filtros (categoría u orden)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  return (
    <section id="ranking" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <Badge variant="secondary" className="mb-3">Paso 2</Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Ranking de prioridad
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Los problemas se ordenan automáticamente según el algoritmo de priorización. La barra
              indica el puntaje sobre 10. Filtra por categoría o cambia el criterio de ordenamiento.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {CATEGORIAS_LIST.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={orden} onValueChange={(v) => setOrden(v as FiltroOrden)}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prioridad">Mayor prioridad</SelectItem>
                <SelectItem value="recientes">Más recientes</SelectItem>
                <SelectItem value="votos">Más votados</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={cargar} title="Recargar">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            Cargando problemas...
          </div>
        ) : problemas.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-slate-500">
              No hay problemas para este filtro. Sé el primero en reportar.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {problemas.map((p, idx) => {
              const cat = getCategoria(p.categoria);
              const nivelKey = nivelPrioridad(p.prioridad);
              const nivel = NIVELES_PRIORIDAD[nivelKey];
              const isTop = idx === 0 && orden === "prioridad";

              return (
                <Card
                  key={p.id}
                  className={`border-slate-200 shadow-sm hover:shadow-md transition-shadow ${
                    isTop ? "ring-2 ring-red-200" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm ${
                            isTop
                              ? "bg-red-100 text-red-700"
                              : idx < 3
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {isTop && (
                              <Badge className="bg-red-600 hover:bg-red-600 text-white gap-1">
                                <Flame className="h-3 w-3" />
                                Más latente
                              </Badge>
                            )}
                            {cat && (
                              <Badge variant="outline" className={cat.color}>
                                {cat.label}
                              </Badge>
                            )}
                            <Badge variant="outline" className={nivel.className}>
                              {nivel.label}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {p.estado.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight text-slate-900">
                            {p.titulo}
                          </CardTitle>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right sm:w-32">
                        <div className="text-3xl font-bold text-slate-900">
                          {p.prioridad.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500">/ 10.0</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {p.descripcion}
                    </p>

                    <Progress value={p.prioridad * 10} className="h-1.5 mb-3" />

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      {p.ubicacion && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {p.ubicacion}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {p.votos} estudiante{p.votos !== 1 ? "s" : ""} afectado
                        {p.votos !== 1 ? "s" : ""}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5" />
                        Severidad {p.severidad}/10
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {timeAgo(p.createdAt)}
                      </span>
                      {p._count && p._count.valoraciones > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {p._count.valoraciones} valoracion
                          {p._count.valoraciones !== 1 ? "es" : ""}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
