"use client";

import { useState } from "react";
import {
  Calculator,
  Check,
  Sparkles,
  Phone,
  Truck,
  Calendar,
} from "lucide-react";

type PlanKey = "day" | "2days" | "3days" | "full" | "hotel";

interface PlanCalculatorProps {
  onOpenBooking: () => void;
}

export default function PlanCalculator({ onOpenBooking }: PlanCalculatorProps) {
  // Calculator state
  const [dogSize, setDogSize] = useState<"small" | "medium" | "large">("medium");
  const [planType, setPlanType] = useState<"day" | "2days" | "3days" | "full" | "hotel">("3days");
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeSpa, setIncludeSpa] = useState(false);

  // Pricing matrix (values in COP for realism)
  const sizeMultipliers = {
    small: 1.0,
    medium: 1.15,
    large: 1.3, // Huskies & large breeds
  };

  const baseRates = {
    day: 40000,
    "2days": 280000, // 8 days/month (~35k/day)
    "3days": 390000, // 12 days/month (~32.5k/day)
    full: 580000, // 20 days/month (~29k/day)
    hotel: 650000, // 10 nights package or ~65k/night
  };

  const transportRate = {
    day: 15000,
    "2days": 90000,
    "3days": 130000,
    full: 200000,
    hotel: 40000,
  };

  const spaRate = {
    small: 40000,
    medium: 50000,
    large: 65000,
  };

  const calculatedBase = Math.round(baseRates[planType] * sizeMultipliers[dogSize]);
  const calculatedTransport = includeTransport ? transportRate[planType] : 0;
  const calculatedSpa = includeSpa ? spaRate[dogSize] : 0;
  const totalPrice = calculatedBase + calculatedTransport + calculatedSpa;

  const planTitles = {
    day: "Pasadía Ocasional (1 Día)",
    "2days": "Plan 2 Días por Semana (8 días/mes)",
    "3days": "Plan 3 Días por Semana (12 días/mes)",
    full: "Plan Mensual Completo (Lunes a Viernes)",
    hotel: "Hospedaje de Hotel (Noche)",
  };

  const sizeLabels = {
    small: "Pequeño (< 10 kg)",
    medium: "Mediano (10 a 25 kg)",
    large: "Grande o Husky (> 25 kg)",
  };

  // WhatsApp link generator
  const getWhatsAppMessage = () => {
    const text = `¡Hola! Vengo de su sitio web y me gustaría reservar/cotizar el siguiente plan para mi perrito:
- Tamaño: ${sizeLabels[dogSize]}
- Plan: ${planTitles[planType]}
- Incluye Ruta de Transporte: ${includeTransport ? "Sí" : "No"}
- Incluye Spa / Deslanado: ${includeSpa ? "Sí" : "No"}
- Total estimado: $${totalPrice.toLocaleString("es-CO")} COP

¿Tienen cupos disponibles y cuándo podemos agendar el día de prueba gratis?`;
    return `https://wa.me/573001234567?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tarifas" className="py-20 bg-gradient-to-b from-white via-sky-50/50 to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span>Tarifas Claras & Transparentes</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Cotiza el plan ideal para tu peludo
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Planes flexibles con o sin transporte. ¡Todos nuestros planes incluyen un <strong>Día de Prueba 100% Gratis</strong> para conocer a tu perrito!
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-2xl shadow-sky-900/10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Step 1: Dog Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Tamaño de tu perro
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setDogSize(size)}
                      className={`p-3 rounded-2xl text-center border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        dogSize === size
                          ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/30 scale-[1.02]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      {size === "small" && "🐕 Pequeño"}
                      {size === "medium" && "🐕‍🦺 Mediano"}
                      {size === "large" && "🐺 Grande/Husky"}
                      <span className="block text-[10px] font-normal opacity-85 mt-0.5">
                        {size === "small" && "< 10 kg"}
                        {size === "medium" && "10-25 kg"}
                        {size === "large" && "> 25 kg"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Frequency / Plan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  2. Modalidad deseada
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: "day" as PlanKey, label: "Pasadía Libre", sub: "1 día" },
                    { key: "2days" as PlanKey, label: "2 Días / Sem", sub: "8 días/mes" },
                    { key: "3days" as PlanKey, label: "3 Días / Sem ⭐", sub: "12 días/mes" },
                    { key: "full" as PlanKey, label: "Mes Completo", sub: "Lun a Vie" },
                    { key: "hotel" as PlanKey, label: "Hospedaje Hotel", sub: "Por noche" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPlanType(p.key)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        planType === p.key
                          ? "bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-sky-200"
                      }`}
                    >
                      <span className="block text-xs sm:text-sm font-bold">
                        {p.label}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {p.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Add-ons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Servicios adicionales
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeTransport}
                        onChange={(e) => setIncludeTransport(e.target.checked)}
                        className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 accent-sky-600"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-sky-600" />
                          Ruta escolar canina puerta a puerta
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Recogida y regreso en furgoneta climatizada y segura
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-700">
                      +${(transportRate[planType]).toLocaleString("es-CO")}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeSpa}
                        onChange={(e) => setIncludeSpa(e.target.checked)}
                        className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 accent-sky-600"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                          Baño de Spa y Deslanado profundo
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Hidromasaje con champú especial y cepillado profesional
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-700">
                      +${(spaRate[dogSize]).toLocaleString("es-CO")}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                    Cotización Estimada
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                    Cupos Limitados
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {planTitles[planType]}
                </h3>
                <p className="text-xs text-sky-200 mb-6">
                  Para perrito {sizeLabels[dogSize]}
                </p>

                {/* Price display */}
                <div className="mb-6 pb-6 border-b border-sky-700/60">
                  <span className="text-xs text-sky-300 block mb-1">
                    Inversión mensual aproximada:
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      ${totalPrice.toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-sky-300 font-semibold">COP</span>
                  </div>
                  <span className="text-[11px] text-sky-200 mt-1 block">
                    *Incluye póliza de emergencias y reportes diarios en video
                  </span>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-6 text-xs text-sky-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Día de prueba gratuito sin compromiso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acceso a 3,000 m² de áreas campestres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Reportes diarios por WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Direct Booking Buttons */}
              <div className="space-y-2.5">
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Pedir Cupo por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="w-full py-3 px-4 rounded-2xl border border-sky-400/40 hover:bg-sky-800 text-sky-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-sky-300" />
                  <span>Completar Formulario de Reserva</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
