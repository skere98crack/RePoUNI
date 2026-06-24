"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIAS_LIST } from "@/components/shared/categorias";
import { Send, Loader2, CheckCircle2, Info } from "lucide-react";

export function RegistroForm({ onCreado }: { onCreado: () => void }) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [ubicacion, setUbicacion] = useState("");
  const [codigoAlumno, setCodigoAlumno] = useState("");
  const [severidad, setSeveridad] = useState(5);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria) {
      toast({
        variant: "destructive",
        title: "Selecciona una categoría",
        description: "Debes elegir el tipo de problema que estás reportando.",
      });
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          categoria,
          ubicacion,
          codigoAlumno,
          severidad,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al registrar");

      toast({
        title: data.duplicado ? "Voto registrado" : "Problema registrado",
        description: data.duplicado
          ? "Otro estudiante ya reportó este problema. Tu voto se sumó al puntaje."
          : "El problema fue creado y priorizado automáticamente.",
      });

      setTitulo("");
      setDescripcion("");
      setCategoria("");
      setUbicacion("");
      setCodigoAlumno("");
      setSeveridad(5);
      onCreado();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast({ variant: "destructive", title: "No se pudo registrar", description: msg });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="registro" className="py-20 bg-white border-y border-slate-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">Paso 1</Badge>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Registra un problema
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Completa el formulario con la mayor cantidad de detalle posible. El sistema clasificará
            y priorizará automáticamente tu reporte. Si otro estudiante ya reportó el mismo problema,
            tu voto se sumará automáticamente.
          </p>
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Formulario de reporte</CardTitle>
            <CardDescription>
              Todos los campos marcados son obligatorios. Tu código de alumno es opcional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del problema *</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Laboratorio de cómputo de Sistemas sin internet"
                  required
                  minLength={5}
                  maxLength={120}
                />
                <p className="text-xs text-slate-500">Mínimo 5 caracteres. Sé específico.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción detallada *</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Explica el problema, su impacto en la FIIS, desde cuándo ocurre y quiénes están afectados (cachimbos, veteranos, docentes)."
                  required
                  minLength={15}
                  maxLength={1000}
                  rows={4}
                />
                <p className="text-xs text-slate-500">Mínimo 15 caracteres.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select value={categoria} onValueChange={setCategoria} required>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_LIST.map((c) => (
                        <SelectItem key={c.key} value={c.key}>
                          {c.label} · peso {c.peso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    placeholder="Ej: FIIS - Pabellón de Industriales, 2do piso"
                    maxLength={120}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="severidad">Severidad (1-10)</Label>
                  <Badge variant="outline" className="font-mono text-base px-3">
                    {severidad}
                  </Badge>
                </div>
                <Slider
                  id="severidad"
                  min={1}
                  max={10}
                  step={1}
                  value={[severidad]}
                  onValueChange={(v) => setSeveridad(v[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1 = Molesto</span>
                  <span>5 = Importante</span>
                  <span>10 = Crítico</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código de alumno (opcional)</Label>
                <Input
                  id="codigo"
                  value={codigoAlumno}
                  onChange={(e) => setCodigoAlumno(e.target.value)}
                  placeholder="Ej: 20230123F (código UNI)"
                  maxLength={20}
                />
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 flex gap-3 text-sm">
                <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-orange-900">
                  Al enviar, el sistema calculará el puntaje de prioridad combinando severidad, peso
                  de la categoría, votos y recencia. Si el problema ya existe, se sumará un voto en
                  lugar de duplicarlo.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setTitulo("");
                    setDescripcion("");
                    setCategoria("");
                    setUbicacion("");
                    setCodigoAlumno("");
                    setSeveridad(5);
                  }}
                >
                  Limpiar
                </Button>
                <Button type="submit" disabled={enviando}>
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar reporte
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

export function FormSuccessIcon() {
  return <CheckCircle2 className="h-5 w-5" />;
}
