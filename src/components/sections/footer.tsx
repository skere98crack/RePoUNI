"use client";

import { Github, CalendarDays } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Logo oficial UNI (versión blanca del footer) */}
              <img
                src="/uni-logo.png"
                alt="Logo Universidad Nacional de Ingeniería"
                className="h-12 w-auto bg-white/95 rounded px-1.5 py-0.5"
                width={48}
                height={26}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold text-white">RePoUNI</span>
                <span className="text-[10px] uppercase tracking-wider text-red-300 font-semibold">
                  UNI · FIIS
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Proyecto académico de la <strong className="text-slate-200">Facultad de Ingeniería Industrial y de Sistemas (FIIS)</strong> de la Universidad Nacional de Ingeniería (UNI). Identifica, organiza y prioriza los problemas que enfrentan los estudiantes, con foco en cachimbos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#registro" className="hover:text-white transition-colors">
                  Registrar problema
                </a>
              </li>
              <li>
                <a href="#ranking" className="hover:text-white transition-colors">
                  Ranking de prioridad
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Categorías
                </a>
              </li>
              <li>
                <a href="#equipo" className="hover:text-white transition-colors">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-white transition-colors">
                  Valorar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Información del proyecto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">Entrega de avance</p>
                  <p className="text-slate-500 text-xs">Semana 13</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CalendarDays className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">Entrega final</p>
                  <p className="text-slate-500 text-xs">Semana 15</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Github className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">Repositorio</p>
                  <p className="text-slate-500 text-xs">github.com/skere98crack/RePoUNI</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-slate-500">
            © {year} RePoUNI · Proyecto académico. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>Perez Diaz Michael Xavier</span>
            <span>·</span>
            <span>Rodriguez Juan José</span>
            <span>·</span>
            <span>Salazar Chamorro Josué Caleb</span>
            <span>·</span>
            <span>Torres Caballa Carlos Javier</span>
            <span>·</span>
            <span>De la Cruz Crispín Jhon Gabriel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
