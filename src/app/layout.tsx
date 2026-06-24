import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RePoUNI · Sistema de Registro de Problemas Universitarios",
  description:
    "Plataforma para que los estudiantes de la universidad reporten, clasifiquen y prioricen problemas de infraestructura, seguridad, ámbito social, estudiantil y académico. Algoritmo de prioridad basado en severidad, frecuencia y recencia.",
  keywords: [
    "RePoUNI",
    "problemas universitarios",
    "registro de problemas",
    "estudiantes",
    "cachimbos",
    "priorización",
    "universidad",
  ],
  authors: [
    { name: "Perez Diaz Michael Xavier" },
    { name: "Rodriguez Juan José" },
    { name: "Salazar Chamorro Josué Caleb" },
    { name: "Torres Caballa Carlos Javier" },
    { name: "De la Cruz Crispín Jhon Gabriel" },
  ],
  openGraph: {
    title: "RePoUNI · Sistema de Registro de Problemas Universitarios",
    description:
      "Reporta, clasifica y prioriza problemas de la universidad. Apoya especialmente a los estudiantes nuevos (cachimbos).",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
