"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Phone,
  Copy,
  Check,
  AlertCircle,
  Luggage,
  ShieldCheck,
  Wind,
  Trees,
  Video,
} from "lucide-react";
import {
  SettingsConfig,
  DEFAULT_SETTINGS,
  subscribeSettings,
} from "@/lib/settings";
import {
  Booking,
  subscribeBookings,
  checkDateAvailability,
} from "@/lib/bookings";
import {
  calculateStayCycles,
  parseSafeDate,
  sanitizeDateStr,
} from "@/lib/dates";

interface PricingCalculatorProps {
  onOpenBooking: () => void;
}

export default function PricingCalculator({ onOpenBooking }: PricingCalculatorProps) {
  // Configuración dinámica desde Firebase
  const [settings, setSettings] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modo de cálculo: 'presets' (rápido por días) o 'dates' (por fechas y horas exactas)
  const [mode, setMode] = useState<"presets" | "dates">("presets");

  // Modo presets
  const [daysCount, setDaysCount] = useState<number>(3);
  const [extraHours, setExtraHours] = useState<number>(0);

  // Modo fechas exactas
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 3);
  const defaultCheckOutStr = tomorrowDate.toISOString().split("T")[0];

  const [checkInDate, setCheckInDate] = useState<string>(todayStr);
  const [checkInTime, setCheckInTime] = useState<string>("09:00");
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultCheckOutStr);
  const [checkOutTime, setCheckOutTime] = useState<string>("12:00");

  const [copiedBancolombia, setCopiedBancolombia] = useState(false);
  const [copiedTransfiya, setCopiedTransfiya] = useState(false);

  // 1. Suscribirse a configuraciones y reservas de Firebase Firestore
  useEffect(() => {
    const unsubSettings = subscribeSettings((newSettings) => {
      setSettings(newSettings);
    });
    const unsubBookings = subscribeBookings((newBookings) => {
      setBookings(newBookings);
    });
    return () => {
      unsubSettings();
      unsubBookings();
    };
  }, []);

  // Tarifas activas parametrizadas
  const rate24h = settings.ratePer24h || 65000;
  const rateExtra = settings.ratePerExtraHour || 10000;

  // Presets rápidos
  const presets = [
    { label: "1 Día (24h)", days: 1, tag: "Pasadía" },
    { label: "Fin de Semana", days: 2, tag: "2 Días" },
    { label: "3 Días", days: 3, tag: "Popular" },
    { label: "1 Semana (Promo 7x6)", days: 7, tag: "1 Día Gratis 🎁", highlight: true },
    { label: "10 Días", days: 10, tag: "Vacaciones" },
    { label: "2 Semanas", days: 14, tag: "2 Días Gratis 🎁", highlight: true },
  ];

  // Cálculo blindado en modo Fechas Exactas:
  const exactDuration = calculateStayCycles(
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    rate24h,
    rateExtra,
    settings.promo7x6Enabled
  );

  // Variables activas según el modo
  const activeDays = mode === "presets" ? daysCount : exactDuration.days;
  const activeExtraHours = mode === "presets" ? extraHours : exactDuration.extraHours;

  // Lógica de tarifa con Promo 7x6 parametrizada
  const isPromo7x6 = settings.promo7x6Enabled && activeDays >= 7;
  const freeDays = isPromo7x6 ? Math.floor(activeDays / 7) : 0;
  const chargeableDays = Math.max(1, activeDays - freeDays);
  const daysTotal = chargeableDays * rate24h;

  // Horas extra con tope máximo equivalente a 1 día
  const extraHoursTotal = Math.min(activeExtraHours * rateExtra, rate24h);
  const totalAmount = mode === "presets" ? (daysTotal + extraHoursTotal) : exactDuration.totalAmount;
  const savings = freeDays * rate24h;

  // Verificación de disponibilidad de aforo en vivo para el rango de fechas
  const getAvailabilityStatus = () => {
    if (mode === "presets") return null;

    const start = parseSafeDate(checkInDate);
    const end = parseSafeDate(checkOutDate);

    if (!start || !end || end.getTime() < start.getTime()) {
      return {
        available: false,
        reason: "Por favor selecciona un rango de fechas válido.",
        remaining: 0,
        capacity: settings.standardCapacity,
      };
    }

    let minRemaining = 999;
    let blockedDay: string | null = null;
    let totalCap = settings.standardCapacity;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const check = checkDateAvailability(dateStr, settings, bookings);
      if (!check.available && check.reason?.includes("cerrada")) {
        blockedDay = dateStr;
        break;
      }
      if (check.remaining < minRemaining) {
        minRemaining = check.remaining;
        totalCap = check.capacity;
      }
    }

    if (blockedDay) {
      return {
        available: false,
        reason: `Recepción no disponible para la fecha ${blockedDay}. Consúltanos por WhatsApp.`,
        remaining: 0,
        capacity: totalCap,
      };
    }

    if (minRemaining <= 0) {
      return {
        available: false,
        reason: "Aforo completo para una o más fechas del rango.",
        remaining: 0,
        capacity: totalCap,
      };
    }

    return {
      available: true,
      remaining: minRemaining,
      capacity: totalCap,
      reason: `¡Cupos confirmados! Hay ${minRemaining} cupo(s) disponibles para tus fechas.`,
    };
  };

  const availabilityInfo = getAvailabilityStatus();

  const handleCopy = (text: string, type: "banco" | "transfiya") => {
    navigator.clipboard.writeText(text);
    if (type === "banco") {
      setCopiedBancolombia(true);
      setTimeout(() => setCopiedBancolombia(false), 2000);
    } else {
      setCopiedTransfiya(true);
      setTimeout(() => setCopiedTransfiya(false), 2000);
    }
  };

  const getWhatsAppEstimateMessage = () => {
    const datesDetail =
      mode === "dates"
        ? `\n- Fechas: Entrada ${checkInDate} (${checkInTime}) ➔ Salida ${checkOutDate} (${checkOutTime})`
        : "";

    const text = `¡Hola Gabriel! 🐾
Estuve cotizando en la web de La Guardería de Kira y me interesa reservar:${datesDetail}
- Duración: ${activeDays} días de 24 horas ${isPromo7x6 ? `(¡Promo 7x6: ${freeDays} día(s) gratis!)` : ""}
- Horas adicionales: ${activeExtraHours} hora(s)
- Total a pagar: $${totalAmount.toLocaleString("es-CO")} COP

¿Tienes cupo disponible para estas fechas en Barranquilla?`;
    return `https://wa.me/573186845602?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tarifas" className="py-20 bg-[#fffaf5] border-y border-orange-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Transparencia & Simplicidad
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            Tarifas Oficiales & Ciclos de 24 Horas
          </h2>
          <p className="text-base text-zinc-600 font-medium">
            Una sola tarifa clara con todo incluido. El ciclo cuenta y se audita estrictamente desde la hora exacta de check-in de tu mascota.
          </p>
        </div>

        {/* Featured Base Price Highlight Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 mb-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                Tarifa Estándar de Hotel Canino
              </span>
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">
                  ${rate24h.toLocaleString("es-CO")}
                </span>
                <span className="text-lg font-bold text-orange-100">COP / Ciclo de 24 Horas</span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100 mt-2 max-w-xl">
                Auditado exactamente a partir de la hora de llegada (ventana de atención: {settings.checkInWindowStart} a {settings.checkInWindowEnd}).
              </p>
            </div>

            {/* Inclusions pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white shrink-0">
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-2 rounded-xl backdrop-blur-sm">
                <Wind className="w-4 h-4 text-cyan-200" />
                <span>Aire Acondicionado 24/7</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-2 rounded-xl backdrop-blur-sm">
                <Trees className="w-4 h-4 text-emerald-200" />
                <span>2 Paseos Diarios al Parque</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>100% Libre de Jaulas</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-2 rounded-xl backdrop-blur-sm">
                <Video className="w-4 h-4 text-rose-200" />
                <span>Fotos & Videos Diarios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector Toggle (Presets vs Fechas Exactas) */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100/70 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner max-w-md w-full">
            <button
              type="button"
              onClick={() => setMode("presets")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "presets"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Calculator className="w-4 h-4 text-orange-600" />
              <span>1. Estimar por Días</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("dates")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "dates"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-orange-600" />
              <span>2. Por Fechas & Aforo en Vivo</span>
            </button>
          </div>
        </div>

        {/* Interactive Calculator Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left: Interactive Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-sm space-y-6 text-left">
            {mode === "presets" ? (
              // MODO A: PRESETS RÁPIDOS
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-black text-lg text-zinc-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-600" />
                    <span>Selecciona la Duración Estimada</span>
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                    {daysCount} {daysCount === 1 ? "Día (24h)" : "Días"}
                  </span>
                </div>

                {/* Fast Presets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                  {presets.map((p) => {
                    const isSelected = daysCount === p.days;
                    return (
                      <button
                        key={p.days}
                        type="button"
                        onClick={() => setDaysCount(p.days)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? "bg-zinc-950 text-white border-zinc-950 shadow-md scale-[1.02]"
                            : p.highlight
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:bg-emerald-100"
                            : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-orange-50 hover:border-orange-300"
                        }`}
                      >
                        <span className="block text-xs font-black">{p.label}</span>
                        <span
                          className={`text-[10px] font-bold block mt-0.5 ${
                            isSelected ? "text-orange-300" : "text-zinc-500"
                          }`}
                        >
                          {p.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Slider for custom days */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1.5">
                    <span>O ajusta días exactos:</span>
                    <span className="text-zinc-900 font-black">
                      {daysCount} días ({daysCount * 24} horas)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="28"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="w-full h-2.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>

                {/* Extra Hours Selector */}
                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-heading font-black text-sm text-zinc-900">
                        Horas adicionales pasadas las 24h
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Cobro modular de ${rateExtra.toLocaleString("es-CO")} COP por hora extra (tope máximo: ${rate24h.toLocaleString("es-CO")}).
                      </p>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800">
                      +{extraHours}h (${extraHoursTotal.toLocaleString("es-CO")})
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setExtraHours(hrs)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          extraHours === hrs
                            ? "bg-orange-600 text-white shadow-sm font-black"
                            : "bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-orange-50"
                        }`}
                      >
                        +{hrs}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // MODO B: SELECCIÓN DE FECHAS & HORAS EXACTAS CON AFORO EN TIEMPO REAL
              <div className="space-y-5">
                <div>
                  <h3 className="font-heading font-black text-lg text-zinc-900 flex items-center gap-2 mb-1">
                    <CalendarIcon className="w-5 h-5 text-orange-600" />
                    <span>Selecciona tus Fechas y Horas de Estadía</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Recepción y entrega dentro del horario oficial: {settings.checkInWindowStart} a {settings.checkInWindowEnd}.
                  </p>
                </div>

                {/* Inputs de Check-in y Check-out */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Check-in */}
                  <div className="p-4 rounded-2xl bg-[#fffaf5] border border-orange-200">
                    <span className="text-[11px] font-black uppercase text-orange-800 block mb-2">
                      🐶 Fecha & Hora de Entrada (Check-in)
                    </span>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={checkInDate}
                        min={todayStr}
                        onChange={(e) => {
                          const clean = sanitizeDateStr(e.target.value);
                          setCheckInDate(clean);
                          if (checkOutDate < clean) setCheckOutDate(clean);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="time"
                        value={checkInTime}
                        min={settings.checkInWindowStart}
                        max={settings.checkInWindowEnd}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Check-out */}
                  <div className="p-4 rounded-2xl bg-[#fffaf5] border border-orange-200">
                    <span className="text-[11px] font-black uppercase text-orange-800 block mb-2">
                      🏠 Fecha & Hora de Salida (Check-out)
                    </span>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={checkOutDate}
                        min={checkInDate}
                        onChange={(e) => setCheckOutDate(sanitizeDateStr(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="time"
                        value={checkOutTime}
                        min={settings.checkInWindowStart}
                        max={settings.checkInWindowEnd}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Availability Badge from Firestore */}
                {availabilityInfo && (
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      availabilityInfo.available
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : "bg-rose-50 border-rose-300 text-rose-950"
                    }`}
                  >
                    {availabilityInfo.available ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-black">
                        {availabilityInfo.available
                          ? `Cupos Disponibles: ${availabilityInfo.remaining} de ${availabilityInfo.capacity} lugares`
                          : "Cupos no disponibles"}
                      </p>
                      <p className="text-[11px] mt-0.5 opacity-90">
                        {availabilityInfo.reason}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
                  <span>Cálculo automático de ciclos:</span>
                  <span className="font-black text-zinc-900">
                    {activeDays} día(s) de 24h + {activeExtraHours}h extra
                  </span>
                </div>
              </div>
            )}

            {/* Promo 7x6 Alert */}
            {isPromo7x6 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="text-xs font-black text-emerald-950">
                    ¡Promoción 7x6 Aplicada! ({freeDays} día gratis)
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Por cada 7 días consecutivos, te regalamos 1 día completo. Ahorras ${savings.toLocaleString("es-CO")} COP.
                  </p>
                </div>
              </div>
            )}

            {/* Check-in info */}
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-2.5 text-xs text-orange-950">
              <Clock className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                <strong>Horario de atención:</strong> Check-in y check-out de {settings.checkInWindowStart} a {settings.checkInWindowEnd}.
              </span>
            </div>
          </div>

          {/* Right: Net Quote & WhatsApp CTA */}
          <div className="lg:col-span-5 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl border border-zinc-800 text-left">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Cotización en Tiempo Real
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Capacidad Transparente
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-zinc-800 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Días de 24h contratados:</span>
                  <span className="font-bold text-white">
                    {activeDays} días ({activeDays * 24}h)
                  </span>
                </div>
                {freeDays > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Descuento Promo 7x6:</span>
                    <span>-{freeDays} día(s) (-${savings.toLocaleString("es-CO")} COP)</span>
                  </div>
                )}
                {activeExtraHours > 0 && (
                  <div className="flex justify-between">
                    <span>Horas adicionales ({activeExtraHours}h):</span>
                    <span className="font-bold text-white">
                      +${extraHoursTotal.toLocaleString("es-CO")} COP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>A/C 24/7 + 2 Paseos + Reportes:</span>
                  <span className="text-emerald-400 font-bold">¡Incluidos!</span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="py-6 border-b border-zinc-800">
                <span className="text-xs text-zinc-400 block mb-1">
                  Inversión Total Estimada:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    ${totalAmount.toLocaleString("es-CO")}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">COP</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  *Auditado exactamente con la tarifa oficial configurada en la plataforma.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp & Form buttons */}
            <div className="pt-6 space-y-3">
              <a
                href={getWhatsAppEstimateMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
              >
                <Phone className="w-4 h-4 fill-zinc-950" />
                <span>Apartar Cupo con Gabriel por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full py-3.5 rounded-full border border-zinc-700 hover:bg-zinc-900 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>Completar Ficha de Reserva Oficial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Row: What to bring & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card: ¿Qué debe traer el huésped? */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-orange-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 font-bold">
              <Luggage className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-black text-base text-zinc-900 mb-1">
                ¿Qué debe traer el huésped?
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                Para tu comodidad y el orden sanitario de la guardería, el huésped debe traer <strong>exclusivamente</strong>:
              </p>
              <ul className="space-y-2 text-xs text-zinc-800 font-bold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Su comida habitual (en porciones medidas para cada día).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Su correa de paseo habitual.</span>
                </li>
              </ul>
              <p className="text-[11px] text-zinc-500 mt-2.5 italic">
                *No requiere traer platos, camas ni juguetes; nosotros proveemos todo en ambiente higiénico.
              </p>
            </div>
          </div>

          {/* Card: Pasarela Financiera Oficial (Datos de Pago) */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-orange-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-black text-base text-zinc-900">
                  Pasarela Financiera Oficial
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                  Pago anticipado
                </span>
              </div>
              <p className="text-xs text-zinc-600 mb-4">
                Transfiere y envía el comprobante a Gabriel para apartar formalmente el cupo:
              </p>

              <div className="space-y-2.5">
                {/* Bancolombia */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fffaf5] border border-orange-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Bancolombia • Cuenta de Ahorros
                    </span>
                    <span className="text-sm font-black text-zinc-900 tracking-wider">
                      55469943363
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("55469943363", "banco")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedBancolombia ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBancolombia ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>

                {/* Transfiya / Llave */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fffaf5] border border-orange-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Llave Bancolombia / Transfiya
                    </span>
                    <span className="text-sm font-black text-zinc-900">
                      @luis8480
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("@luis8480", "transfiya")}
                    className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedTransfiya ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTransfiya ? "Copiado" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
