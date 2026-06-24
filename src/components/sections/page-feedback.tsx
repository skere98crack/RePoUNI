"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Star, MessageSquare, ThumbsUp } from "lucide-react";

type Calificacion = {
  id: string;
  puntaje: number;
  comentario: string | null;
  codigoAlumno: string | null;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Hace un momento";
  if (min < 60) return `Hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

function mostrarAutor(codigo: string | null): string {
  if (!codigo) return "Anónimo";
  return `Código: ${codigo}`;
}

function inicialesAutor(codigo: string | null): string {
  if (!codigo) return "A";
  return codigo.slice(0, 2).toUpperCase();
}

export function PageFeedback() {
  const { toast } = useToast();
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [puntaje, setPuntaje] = useState(8);
  const [comentario, setComentario] = useState("");
  const [codigoAlumno, setCodigoAlumno] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/page-feedback");
      const data = await res.json();
      setCalificaciones(data.calificaciones ?? []);
      setPromedio(data.promedio ?? 0);
      setTotal(data.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch("/api/page-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puntaje, comentario, codigoAlumno }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      toast({
        title: "¡Gracias por tu calificación!",
        description: codigoAlumno
          ? "Tu calificación fue registrada con tu código."
          : "Tu calificación anónima fue registrada.",
      });
      setComentario("");
      setCodigoAlumno("");
      setPuntaje(8);
      cargar();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ variant: "destructive", title: "No se pudo registrar", description: msg });
    } finally {
      setEnviando(false);
    }
  };

  // Distribución de puntajes (1-10)
  const dist: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) dist[i] = 0;
  for (const c of calificaciones) {
    dist[c.puntaje] = (dist[c.puntaje] || 0) + 1;
  }
  const maxDist = Math.max(1, ...Object.values(dist));

  return (
    <section id="calificar-pagina" className="py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-800 mb-3">
            Califica nuestra plataforma
          </span>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            ¿Qué te parece RePoUNI?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Tu calificación y comentarios nos ayudan a mejorar el sistema. Puedes calificar de forma
            <strong className="text-foreground"> anónima</strong> o dejar tu código de alumno si quieres que sepamos que fuiste tú.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-xl">Tu calificación</CardTitle>
              <CardDescription>
                Todos los campos son opcionales excepto el puntaje.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="puntaje-pagina">Puntaje (1-10) *</Label>
                    <Badge variant="outline" className="font-mono text-base px-3 gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {puntaje}
                    </Badge>
                  </div>
                  <Slider
                    id="puntaje-pagina"
                    min={1}
                    max={10}
                    step={1}
                    value={[puntaje]}
                    onValueChange={(v) => setPuntaje(v[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 = Muy mala</span>
                    <span>5 = Aceptable</span>
                    <span>10 = Excelente</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentario-pagina">Comentario / Recomendación</Label>
                  <Textarea
                    id="comentario-pagina"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Cuéntanos qué te pareció la plataforma, qué mejorarías, qué funcionalidad agregarías..."
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {comentario.length}/500 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo-pagina">
                    Código de alumno (opcional - deja vacío para anónimo)
                  </Label>
                  <Input
                    id="codigo-pagina"
                    value={codigoAlumno}
                    onChange={(e) => setCodigoAlumno(e.target.value)}
                    placeholder="Ej: 20230123F (código UNI)"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Si dejas vacío, tu calificación será anónima.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={enviando} className="w-full sm:w-auto">
                    {enviando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar calificación
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Estadísticas y comentarios */}
          <div className="space-y-4">
            {/* Promedio destacado */}
            <Card className="shadow-sm border-border bg-primary text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-red-50">
                      Promedio de la comunidad
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-bold">
                        {loading ? "—" : promedio.toFixed(1)}
                      </span>
                      <span className="text-lg text-red-100">/ 10</span>
                    </div>
                    <p className="text-xs text-red-100 mt-1">
                      {total} calificación{total !== 1 ? "es" : ""} recibida{total !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-12 w-12 fill-amber-300 text-amber-300" />
                    <span className="text-xs text-red-100 mt-1">
                      {promedio >= 8 ? "Excelente" : promedio >= 6 ? "Bueno" : promedio >= 4 ? "Mejorable" : "Por mejorar"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribución de puntajes */}
            {!loading && total > 0 && (
              <Card className="shadow-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-primary" />
                    Distribución de puntajes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1.5">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((p) => {
                      const count = dist[p] || 0;
                      const pct = (count / maxDist) * 100;
                      return (
                        <div key={p} className="flex items-center gap-2 text-xs">
                          <span className="w-6 text-muted-foreground font-mono">{p}</span>
                          <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-muted-foreground font-mono">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comentarios recientes */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Comentarios recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando comentarios...
                  </div>
                ) : calificaciones.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Aún no hay comentarios. ¡Sé el primero en calificar!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {calificaciones.slice(0, 10).map((c) => (
                      <div
                        key={c.id}
                        className="flex gap-3 p-3 rounded-lg border border-border bg-background"
                      >
                        <Avatar className="h-9 w-9 border border-border flex-shrink-0">
                          <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                            {inicialesAutor(c.codigoAlumno)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground truncate">
                              {mostrarAutor(c.codigoAlumno)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary flex-shrink-0">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {c.puntaje}
                            </span>
                          </div>
                          {c.comentario ? (
                            <p className="text-sm text-muted-foreground leading-relaxed break-words">
                              {c.comentario}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Sin comentario
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {timeAgo(c.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
