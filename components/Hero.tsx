"use client";

import {
  ArrowRight,
  Phone,
} from "lucide-react";

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 bg-[#fbeee6] overflow-hidden rounded-b-[2.5rem] border-b border-orange-200/60"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Content Layout */}
        <div className="flex flex-col items-center text-center">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-orange-200 text-zinc-800 text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Barranquilla, Colombia</span>
            <span className="text-zinc-300">•</span>
            <span className="text-orange-700">100% Libre de Jaulas con A/C</span>
          </div>

          {/* Bold Catchy Headline (inspired by Sit. Stay. Smile!) */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-[1.05] max-w-4xl mb-4">
            ¡Libre. Fresquito.{" "}
            <span className="text-[#ee7b42]">Feliz!</span>
          </h1>

          {/* Subtitle with official value proposition */}
          <p className="text-base sm:text-lg lg:text-xl text-zinc-700 max-w-2xl font-medium leading-relaxed mb-8">
            El segundo hogar de tu peludo en <strong className="text-zinc-900 font-bold">Barranquilla</strong>. Convivencia familiar y abierta, descanso refrigerado con <strong className="text-zinc-900 font-bold">aire acondicionado</strong>, <strong className="text-zinc-900 font-bold">2 paseos diarios al parque</strong> y reportes constantes con fotos y videos a tu WhatsApp.
          </p>

          {/* Action Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto pill-btn pill-btn-dark px-8 py-4 text-base font-extrabold shadow-lg shadow-zinc-950/15"
            >
              <span>Apartar Cupo ($65.000 / 24h)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Quisiera%20consultar%20disponibilidad%20en%20La%20Guarder%C3%ADa%20de%20Kira"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto pill-btn pill-btn-outline px-6 py-4 text-base font-bold border-zinc-300 hover:border-zinc-400"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Chatear con Gabriel</span>
            </a>
          </div>

          {/* 4 Innegotiable Pillars Micro-Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200/80 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm">
              🐾 100% Libre de Jaulas
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200/80 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm">
              ❄️ Aire Acondicionado 24/7
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200/80 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm">
              🌳 2 Paseos al Parque
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200/80 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm">
              📹 Fotos & Videos Diarios
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
