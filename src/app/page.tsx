"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { RegistroForm } from "@/components/sections/registro-form";
import { Ranking } from "@/components/sections/ranking";
import { Servicios } from "@/components/sections/servicios";
import { Equipo } from "@/components/sections/equipo";
import { Feedback } from "@/components/sections/feedback";
import { Footer } from "@/components/sections/footer";

type Stats = {
  total: number;
  abiertos: number;
  enProgreso: number;
  resueltos: number;
  totalVotos: number;
  totalValoraciones: number;
  promedioPrioridad: number;
};

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, [refreshKey]);

  const onCreado = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero stats={stats} />
        <RegistroForm onCreado={onCreado} />
        <Ranking key={`ranking-${refreshKey}`} />
        <Servicios />
        <Equipo />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}
