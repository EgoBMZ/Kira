"use client";

import { useState } from "react";
import {
  Heart,
  Wind,
  Trees,
  Video,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function PillarsCarousel() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: "cage-free",
      badge: "Convivencia Familiar",
      title: "100% Libre de Jaulas",
      tagline: "Cero encierros. Libertad y juego con amigos todo el día.",
      desc: "En La Guardería de Kira los perros no van a celdas frías. Viven en una dinámica de convivencia abierta donde duermen, juegan y socializan acompañados de nuestro equipo las 24 horas.",
      bgColor: "bg-[#dbeafe]", // soft powder blue like the inspiration image
      textColor: "text-sky-950",
      accentColor: "bg-sky-500",
      icon: Heart,
      emoji: "🐕‍🦺",
    },
    {
      id: "ac",
      badge: "Confort Térmico",
      title: "Climatización Total (A/C)",
      tagline: "Suites refrigeradas para el calor de Barranquilla.",
      desc: "Barranquilla es calurosa y nuestros peludos necesitan frescura. Contamos con aire acondicionado constante para las horas de descanso, asegurando que duerman plácidamente y sin riesgo de golpe de calor.",
      bgColor: "bg-[#e0f2fe]", // soft icy sky
      textColor: "text-blue-950",
      accentColor: "bg-blue-600",
      icon: Wind,
      emoji: "❄️",
    },
    {
      id: "walks",
      badge: "Salud & Drenaje Físico",
      title: "2 Paseos Diarios al Parque",
      tagline: "Rutina activa para drenar energía sanamente.",
      desc: "No nos quedamos encerrados. Cada huésped disfruta de 2 paseos programados al parque todos los días con su correa habitual, permitiéndoles oler, caminar y ejercitarse de manera segura.",
      bgColor: "bg-[#e6f7f2]", // soft fresh mint
      textColor: "text-emerald-950",
      accentColor: "bg-emerald-600",
      icon: Trees,
      emoji: "🌳",
    },
    {
      id: "reports",
      badge: "Tranquilidad Total",
      title: "Fotos y Videos Diarios",
      tagline: "Reportes constantes directo a tu WhatsApp.",
      desc: "Sabemos cuánto extrañas a tu perro. Te enviamos fotos y videos a lo largo de toda su estadía para que veas cómo juega, cómo come y cómo duerme.",
      bgColor: "bg-[#fef3c7]", // soft warm butter
      textColor: "text-amber-950",
      accentColor: "bg-amber-600",
      icon: Video,
      emoji: "📹",
    },
  ];

  return (
    <section id="pilares" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            Nuestros Pilares Innegociables
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            ¿Por qué los papás perrunos confían en Kira?
          </h2>
          <p className="text-base text-zinc-600 font-medium">
            Protocolos oficiales diseñados para la salud, frescura y felicidad absoluta de tu consentido.
          </p>
        </div>

        {/* 4 Soft Pastel Pill Cards Grid (inspired by Pet Services Mobile UX) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => setActiveTab(index)}
                className={`${pillar.bgColor} rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer border border-black/5 relative overflow-hidden group`}
              >
                <div>
                  {/* Top Emoji Avatar & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {pillar.emoji}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/70 text-zinc-800 backdrop-blur-sm">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className={`font-heading font-extrabold text-xl sm:text-2xl ${pillar.textColor} mb-2 leading-tight`}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 mb-4 leading-snug">
                    {pillar.tagline}
                  </p>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-black/10">
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots (like the image) */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeTab === idx
                  ? "w-7 bg-zinc-900"
                  : "bg-zinc-300 hover:bg-zinc-400"
              }`}
              aria-label={`Ver pilar ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
