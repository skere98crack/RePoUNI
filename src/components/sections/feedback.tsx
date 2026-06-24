"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Star } from "lucide-react";

type Problema = {
  id: string;
  titulo: string;
  categoria: string;
  prioridad: number;
};

export function Feedback() {
  const { toast } = useToast();
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [problemaId, setProblemaId] = useState<string>("");
  const [puntaje, setPuntaje] = useState(7);
  const [comentario, setComentario] = useState("");
  const [sugerencia, setSugerencia] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch("/api/problems?orden=prioridad")
      .then((r) => r.json())
      .then((data) => setProblemas(data.problemas ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemaId) {
      toast({
        variant: "destructive",
        title: "Selecciona un problema",
        description: "Debes elegir sobre cuál problema dar tu valoración.",
      });
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemaId, puntaje, comentario, sugerencia }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      toast({
        title: "Valoración registrada",
        description: "Gracias por tu feedback. Nos ayuda a mejorar el sistema.",
      });
      setComentario("");
      setSugerencia("");
      setPuntaje(7);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ variant: "destructive", title: "No se pudo registrar", description: msg });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="feedback" className="py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-800 mb-3">
            Criterio de éxito
          </span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Valora el sistema y deja sugerencias
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Tu valoración (1-10) nos permite medir el criterio de éxito del proyecto. Los comentarios
            y sugerencias son anónimos y se usan para mejorar la plataforma.
          </p>
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Formulario de valoración</CardTitle>
            <CardDescription>
              Selecciona un problema existente y cuéntanos tu experiencia o sugerencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="problema">Problema a valorar *</Label>
                {problemas.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando problemas...
                  </div>
                ) : (
                  <Select value={problemaId} onValueChange={setProblemaId} required>
                    <SelectTrigger id="problema">
                      <SelectValue placeholder="Selecciona un problema" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemas.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          [{p.prioridad.toFixed(1)}] {p.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="puntaje">Puntaje del 1 al 10 *</Label>
                  <Badge variant="outline" className="font-mono text-base px-3 gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {puntaje}
                  </Badge>
                </div>
                <Slider
                  id="puntaje"
                  min={1}
                  max={10}
                  step={1}
                  value={[puntaje]}
                  onValueChange={(v) => setPuntaje(v[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1 = Muy mala experiencia</span>
                  <span>10 = Excelente experiencia</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentario">Comentario (opcional)</Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos tu experiencia con este problema o con el sistema en general."
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sugerencia">Sugerencia de mejora (opcional)</Label>
                <Textarea
                  id="sugerencia"
                  value={sugerencia}
                  onChange={(e) => setSugerencia(e.target.value)}
                  placeholder="¿Qué cambiarías del sistema para que sea más útil?"
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={enviando}>
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar valoración
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
