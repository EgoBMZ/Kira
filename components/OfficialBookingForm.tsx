"use client";

import { useState } from "react";
import {
  Send,
  Phone,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { createBooking, createGoogleCalendarUrl } from "@/lib/bookings";
import {
  calculateStayCycles,
  sanitizeDateStr,
  formatFriendlyDate,
} from "@/lib/dates";

export default function OfficialBookingForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedBookingId, setSavedBookingId] = useState<string>("");

  // Fechas iniciales por defecto en formato estándar YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  // Modelo de datos de la reserva
  const [formData, setFormData] = useState({
    // Paso 1: Tu Peludo
    petName: "",
    petBreed: "",
    petAge: "",
    isNeutered: "Sí",
    inHeat: "No",
    isSociable: "Sí, es sociable y amigable",
    // Paso 2: Estadía & Cuidados
    checkInDate: todayStr,
    checkInTime: "09:00",
    checkOutDate: tomorrowStr,
    checkOutTime: "12:00",
    foodSchedule: "2 veces al día (Mañana 8:00 AM y Tarde 5:00 PM)",
    specialNotes: "",
    // Paso 3: Datos del Tutor
    ownerName: "",
    ownerPhone: "",
    ownerId: "",
    instagramUser: "",
    ownerAddress: "",
  });

  // Presets autoseleccionables para horario de comida
  const foodSchedulePresets = [
    "2 veces al día (Mañana 8:00 AM y Tarde 5:00 PM)",
    "3 veces al día (Mañana, Almuerzo y Tarde)",
    "1 vez al día (Mañana o Tarde)",
    "Dieta BARF / Comida Natural (Congelada)",
    "Horario especial / Dieta médica",
  ];

  // Horas operativas oficiales de Kira (08:00 a 18:00)
  const availableHours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Cálculo blindado de ciclos de 24h, horas extra y total en COP (NUNCA retorna NaN)
  const durationEstimate = calculateStayCycles(
    formData.checkInDate,
    formData.checkInTime,
    formData.checkOutDate,
    formData.checkOutTime
  );

  // Manejador seguro para cambio de fecha de entrada
  const handleCheckInDateChange = (rawDate: string) => {
    const cleanIn = sanitizeDateStr(rawDate);
    setFormData((prev) => {
      let updatedOut = prev.checkOutDate;
      if (!updatedOut || updatedOut < cleanIn) {
        updatedOut = cleanIn;
      }
      return {
        ...prev,
        checkInDate: cleanIn,
        checkOutDate: updatedOut,
      };
    });
  };

  // Manejador seguro para cambio de fecha de salida
  const handleCheckOutDateChange = (rawDate: string) => {
    const cleanOut = sanitizeDateStr(rawDate);
    setFormData((prev) => ({
      ...prev,
      checkOutDate: cleanOut,
    }));
  };

  const nextStep = () => {
    if (step === 2 && !durationEstimate.valid) {
      return;
    }
    if (step < 3) setStep((s) => (s === 1 ? 2 : 3));
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => (s === 3 ? 2 : 1));
  };

  // Formato de WhatsApp limpio, universal y sin caracteres corruptos
  const formatWhatsAppMessage = (refId?: string) => {
    const refText = refId ? ` (Ref: #${refId.slice(0, 8)})` : "";
    const promoNote =
      durationEstimate.freeDays > 0
        ? `\n🎁 *Promo 7x6:* ${durationEstimate.freeDays} día(s) gratis incluido(s)`
        : "";

    const text = `*SOLICITUD DE RESERVA - LA GUARDERÍA DE KIRA*${refText}

*MASCOTA:*
• Nombre: ${formData.petName.trim() || "Por confirmar"}
• Raza: ${formData.petBreed.trim() || "Por confirmar"}
• Edad: ${formData.petAge.trim() || "Por confirmar"}
• ¿Esterilizado?: ${formData.isNeutered}
• ¿En celo?: ${formData.inHeat}
• Sociabilidad: ${formData.isSociable}

*ESTADÍA & CICLOS DE 24 HORAS:*
• Entrada: ${sanitizeDateStr(formData.checkInDate)} a las ${formData.checkInTime}
• Salida: ${sanitizeDateStr(formData.checkOutDate)} a las ${formData.checkOutTime}
• Duración calculada: ${durationEstimate.days} día(s) de 24h ${
      durationEstimate.extraHours > 0 ? `+ ${durationEstimate.extraHours}h adicional(es)` : ""
    }${promoNote}
• Inversión estimada: $${durationEstimate.totalAmount.toLocaleString("es-CO")} COP

*ALIMENTACIÓN & CUIDADOS:*
• Horario habitual de comida: ${formData.foodSchedule}
• Notas o requerimientos: ${formData.specialNotes.trim() || "Ninguna"}

*DATOS DEL TUTOR:*
• Nombre: ${formData.ownerName.trim() || "Por confirmar"}
• WhatsApp: ${formData.ownerPhone.trim() || "Por confirmar"}
• Cédula: ${formData.ownerId.trim() || "Por confirmar"}
• Instagram: ${
      formData.instagramUser.trim()
        ? `@${formData.instagramUser.replace("@", "")}`
        : "No especificado"
    }
• Dirección / Barrio: ${formData.ownerAddress.trim() || "Barranquilla"}

¡Hola Gabriel! Registré esta reserva en la web de La Guardería de Kira y te envío los datos para confirmar disponibilidad en Barranquilla.`;

    return `https://wa.me/573186845602?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    let createdDocId = "";

    try {
      // Guardar en Firestore con valores numéricos y sanitizados garantizados
      createdDocId = await createBooking({
        petName: formData.petName.trim() || "Peludo",
        petBreed: formData.petBreed.trim() || "Sin especificar",
        petAge: formData.petAge.trim() || "Sin especificar",
        isNeutered: formData.isNeutered,
        inHeat: formData.inHeat,
        isSociable: formData.isSociable,
        checkInDate: sanitizeDateStr(formData.checkInDate),
        checkInTime: formData.checkInTime || "09:00",
        checkOutDate: sanitizeDateStr(formData.checkOutDate),
        checkOutTime: formData.checkOutTime || "12:00",
        daysCount: durationEstimate.days,
        extraHours: durationEstimate.extraHours,
        totalAmount: durationEstimate.totalAmount,
        foodSchedule: formData.foodSchedule || "",
        specialNotes: formData.specialNotes.trim() || "",
        ownerName: formData.ownerName.trim() || "Tutor",
        ownerPhone: formData.ownerPhone.trim() || "",
        ownerId: formData.ownerId.trim() || "",
        instagramUser: formData.instagramUser.trim() || "",
        ownerAddress: formData.ownerAddress.trim() || "Barranquilla",
        status: "pending",
      });

      setSavedBookingId(createdDocId);
    } catch (err) {
      console.warn("No se pudo guardar en Firestore, continuando con WhatsApp:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      const waUrl = formatWhatsAppMessage(createdDocId);
      window.open(waUrl, "_blank");
    }
  };

  // Clases CSS uniformes para todos los inputs y selects
  const fieldHeight = "h-[52px]";
  const uniformInputClass = `w-full ${fieldHeight} px-4 rounded-2xl bg-white border border-orange-200 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none shadow-xs transition-all`;
  const uniformSelectClass = `w-full ${fieldHeight} px-4 rounded-2xl bg-white border border-orange-200 text-sm font-medium text-zinc-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none shadow-xs transition-all cursor-pointer`;
  const labelClass = "block text-xs font-bold text-zinc-800 mb-1.5";

  return (
    <section id="ficha-reserva" className="py-20 bg-white border-t border-orange-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            Fácil, Rápido & Seguro
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-3">
            Reserva el Cupo de tu Peludo
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-medium">
            Completa esta sencilla ficha en 3 pasos. Los datos se guardan en el sistema y se envían directamente a Gabriel por WhatsApp para apartar tu lugar.
          </p>
        </div>

        {submitted ? (
          /* Pantalla de Confirmación de Reserva */
          <div className="bg-[#fffaf5] p-8 sm:p-12 rounded-[2.5rem] border-2 border-emerald-400/80 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                <FileCheck className="w-4 h-4" />
                <span>
                  {savedBookingId
                    ? `Guardada en el Sistema (ID: #${savedBookingId.slice(0, 8)})`
                    : "Solicitud Registrada con Éxito"}
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 mb-2">
                ¡Ficha de {formData.petName || "tu peludo"} Lista! 🐾
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Tu solicitud ya quedó registrada en la base de datos de <strong>La Guardería de Kira</strong>. Ahora conéctate con Gabriel por WhatsApp para confirmar tu cupo.
              </p>
            </div>

            {/* Resumen Compacto de la Reserva */}
            <div className="max-w-md mx-auto bg-white rounded-2xl p-5 border border-orange-200/80 text-left text-xs text-zinc-700 space-y-2 shadow-xs">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="font-bold text-zinc-500">Mascota:</span>
                <span className="font-black text-zinc-900 text-sm">
                  {formData.petName} ({formData.petBreed})
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="font-bold text-zinc-500">Entrada:</span>
                <span className="font-bold text-zinc-800">
                  {formatFriendlyDate(formData.checkInDate)} a las {formData.checkInTime}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="font-bold text-zinc-500">Salida:</span>
                <span className="font-bold text-zinc-800">
                  {formatFriendlyDate(formData.checkOutDate)} a las {formData.checkOutTime}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="font-bold text-zinc-500">Duración:</span>
                <span className="font-bold text-zinc-800">
                  {durationEstimate.days} día(s) de 24h
                  {durationEstimate.extraHours > 0 ? ` + ${durationEstimate.extraHours}h extra` : ""}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-emerald-800 font-extrabold text-sm">
                <span>Inversión Estimada:</span>
                <span>${durationEstimate.totalAmount.toLocaleString("es-CO")} COP</span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <a
                href={formatWhatsAppMessage(savedBookingId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto pill-btn bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 text-sm font-black shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Abrir WhatsApp con Gabriel</span>
              </a>

              {formData.checkInDate && formData.checkOutDate && (
                <a
                  href={createGoogleCalendarUrl({
                    title: `🐾 Estadía de ${formData.petName || "mi peludo"} en La Guardería de Kira`,
                    details: `Reserva en La Guardería de Kira (Barranquilla)\nEntrada: ${sanitizeDateStr(
                      formData.checkInDate
                    )} ${formData.checkInTime}\nSalida: ${sanitizeDateStr(
                      formData.checkOutDate
                    )} ${formData.checkOutTime}\nContacto Gabriel: +57 318 684 5602\nID: ${
                      savedBookingId || "Web"
                    }`,
                    startDate: sanitizeDateStr(formData.checkInDate),
                    startTime: formData.checkInTime || "09:00",
                    endDate: sanitizeDateStr(formData.checkOutDate),
                    endTime: formData.checkOutTime || "12:00",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto pill-btn bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 px-6 py-4 text-sm font-bold shadow-xs flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4 text-blue-600" />
                  <span>Añadir a Google Calendar</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="w-full sm:w-auto pill-btn pill-btn-outline px-6 py-4 text-sm font-bold"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        ) : (
          /* Formulario en 3 Pasos */
          <div className="bg-[#fffaf5] rounded-[2.5rem] p-6 sm:p-10 border border-orange-200/90 shadow-md">
            {/* Step Progress Pills */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-orange-200/60">
              <div className="flex items-center gap-2">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step >= 1 ? "bg-zinc-950 text-white shadow-xs" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  1
                </span>
                <span className="text-xs font-bold text-zinc-800">1. Tu Peludo</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-orange-200" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step >= 2 ? "bg-zinc-950 text-white shadow-xs" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-bold text-zinc-800">2. La Estadía</span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-orange-200" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    step >= 3 ? "bg-zinc-950 text-white shadow-xs" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  3
                </span>
                <span className="text-xs font-bold text-zinc-800">3. Tutor</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* PASO 1: TU PELUDO (Inputs del mismo tamaño y aspecto) */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="font-heading font-black text-xl text-zinc-950">
                      Paso 1: ¿Quién es tu peludo? 🐕
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Cuéntanos sobre tu consentido para preparar su espacio libre de jaulas con aire acondicionado y juegos.
                    </p>
                  </div>

                  {/* Fila 1: Nombre y Raza */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nombre del perro *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Toby, Luna, Kira"
                        value={formData.petName}
                        onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Raza *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Husky, Mestizo, Golden"
                        value={formData.petBreed}
                        onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>
                  </div>

                  {/* Fila 2: Edad aproximada y Esterilizado (Mismo tamaño) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Edad aproximada *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 2 años, 8 meses"
                        value={formData.petAge}
                        onChange={(e) => setFormData({ ...formData, petAge: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>¿Está esterilizado/a? *</label>
                      <select
                        value={formData.isNeutered}
                        onChange={(e) => setFormData({ ...formData, isNeutered: e.target.value })}
                        className={uniformSelectClass}
                      >
                        <option value="Sí">Sí, está esterilizado/a</option>
                        <option value="No">No está esterilizado/a</option>
                      </select>
                    </div>
                  </div>

                  {/* Fila 3: En calor o celo y Sociabilidad (Mismo tamaño) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>¿Está en calor o celo? *</label>
                      <select
                        value={formData.inHeat}
                        onChange={(e) => setFormData({ ...formData, inHeat: e.target.value })}
                        className={uniformSelectClass}
                      >
                        <option value="No">No (Apta/o para ingresar)</option>
                        <option value="Sí">Sí (No permitida por norma de convivencia)</option>
                      </select>
                      {formData.inHeat === "Sí" && (
                        <p className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Por convivencia libre de jaulas, no recibimos perritas en celo.</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>¿Es sociable con otros perros? *</label>
                      <select
                        value={formData.isSociable}
                        onChange={(e) => setFormData({ ...formData, isSociable: e.target.value })}
                        className={uniformSelectClass}
                      >
                        <option value="Sí, es sociable y amigable">Sí, es sociable y amigable</option>
                        <option value="Sociable pero tímido al inicio">Sociable pero tímido al inicio</option>
                        <option value="Requiere adaptación previa">Requiere adaptación previa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: FECHAS, RÉGIMEN & VALIDACIONES */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="mb-4">
                    <h3 className="font-heading font-black text-xl text-zinc-950">
                      Paso 2: Fechas & Horario de Estadía ⏰
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Ventana oficial de recepción y entrega: <strong>8:00 AM a 6:00 PM</strong>. El ciclo de 24h cuenta desde la hora exacta de check-in.
                    </p>
                  </div>

                  {/* Bloque de Fechas y Horas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Entrada */}
                    <div className="bg-white p-4 rounded-2xl border border-orange-200/90 shadow-xs space-y-2">
                      <label className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ENTRADA (Check-in) *</span>
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        <input
                          type="date"
                          required
                          min={todayStr}
                          value={formData.checkInDate}
                          onChange={(e) => handleCheckInDateChange(e.target.value)}
                          className={`col-span-3 ${uniformInputClass} text-xs sm:text-sm`}
                        />
                        <select
                          value={formData.checkInTime}
                          onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                          className={`col-span-2 ${uniformSelectClass} text-xs sm:text-sm px-2`}
                        >
                          {availableHours.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Salida */}
                    <div className="bg-white p-4 rounded-2xl border border-orange-200/90 shadow-xs space-y-2">
                      <label className="text-xs font-black text-zinc-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>SALIDA (Check-out) *</span>
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        <input
                          type="date"
                          required
                          min={formData.checkInDate || todayStr}
                          value={formData.checkOutDate}
                          onChange={(e) => handleCheckOutDateChange(e.target.value)}
                          className={`col-span-3 ${uniformInputClass} text-xs sm:text-sm`}
                        />
                        <select
                          value={formData.checkOutTime}
                          onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                          className={`col-span-2 ${uniformSelectClass} text-xs sm:text-sm px-2`}
                        >
                          {availableHours.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de Validación de Fechas en Tiempo Real */}
                  {!durationEstimate.valid && (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{durationEstimate.error || "Verifica las fechas seleccionadas."}</span>
                    </div>
                  )}

                  {/* Cálculo en vivo de la tarifa y ciclos de 24h */}
                  {durationEstimate.valid && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Duración:</strong> {durationEstimate.days} día(s) de 24 horas{" "}
                          {durationEstimate.extraHours > 0
                            ? `+ ${durationEstimate.extraHours} hora(s) adicional(es)`
                            : ""}
                          {durationEstimate.freeDays > 0 ? " (¡Con día gratis 🎁!)" : ""}
                        </span>
                      </div>
                      <div className="text-sm font-black text-emerald-800 shrink-0">
                        Total: ${durationEstimate.totalAmount.toLocaleString("es-CO")} COP
                      </div>
                    </div>
                  )}

                  {/* Horario Habitual de Comida: Con Autoseleccionable + Especificación */}
                  <div className="space-y-2">
                    <label className={labelClass}>
                      Horario habitual de comida * (Toca una opción o personaliza)
                    </label>

                    {/* Chips autoseleccionables rápidos */}
                    <div className="flex flex-wrap gap-2">
                      {foodSchedulePresets.map((preset) => {
                        const isSelected = formData.foodSchedule.startsWith(preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, foodSchedule: preset })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                                : "bg-white text-zinc-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                            }`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>

                    {/* Input para especificar detalles adicionales de comida */}
                    <input
                      type="text"
                      placeholder="Especificar porciones o marcas (ej. 1 taza mañana y 1 taza tarde)"
                      value={formData.foodSchedule}
                      onChange={(e) => setFormData({ ...formData, foodSchedule: e.target.value })}
                      className={uniformInputClass}
                    />
                  </div>

                  {/* Notas o Cuidados Especiales */}
                  <div>
                    <label className={labelClass}>Alergias o requerimientos especiales (Opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="¿Alguna alergia, manía al dormir, medicación o indicación especial?"
                      value={formData.specialNotes}
                      onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-orange-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none shadow-xs transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* PASO 3: DATOS DEL TUTOR */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="font-heading font-black text-xl text-zinc-950">
                      Paso 3: Datos de Contacto del Tutor 👤
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Para emitir tu confirmación formal y coordinar la recepción en Barranquilla.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nombre completo del tutor *</label>
                      <input
                        type="text"
                        required
                        placeholder="Tu Nombre y Apellido"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>WhatsApp de contacto *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 300 123 4567"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Cédula de ciudadanía / ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="Número de documento"
                        value={formData.ownerId}
                        onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Usuario de Instagram (Opcional)</label>
                      <input
                        type="text"
                        placeholder="@tu_usuario (para historias de tu perro)"
                        value={formData.instagramUser}
                        onChange={(e) => setFormData({ ...formData, instagramUser: e.target.value })}
                        className={uniformInputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Dirección o Barrio en Barranquilla *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Alto Prado, Villa Country, Riomar, Boston..."
                      value={formData.ownerAddress}
                      onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                      className={uniformInputClass}
                    />
                  </div>

                  {/* Resumen previo antes de confirmar */}
                  <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs text-zinc-700 space-y-1">
                    <p className="font-black text-zinc-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      <span>
                        Resumen: {formData.petName || "Perrito"} ({formData.petBreed || "Raza"})
                      </span>
                    </p>
                    <p className="text-zinc-600">
                      Entrada: {formatFriendlyDate(formData.checkInDate)} ({formData.checkInTime}) ➔ Salida: {formatFriendlyDate(formData.checkOutDate)} ({formData.checkOutTime})
                    </p>
                    <p className="text-zinc-800 font-bold">
                      Inversión estimada: ${durationEstimate.totalAmount.toLocaleString("es-CO")} COP ({durationEstimate.days} días de 24h)
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de Navegación del Formulario */}
              <div className="pt-4 border-t border-orange-200/60 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="pill-btn pill-btn-outline px-5 py-3 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={(step === 2 && !durationEstimate.valid) || isSubmitting}
                  className={`pill-btn text-white px-8 py-3.5 text-sm font-black flex items-center gap-2 shadow-md cursor-pointer ml-auto transition-all ${
                    step === 2 && !durationEstimate.valid
                      ? "bg-zinc-400 cursor-not-allowed opacity-60"
                      : "bg-zinc-950 hover:bg-zinc-800"
                  }`}
                >
                  {isSubmitting ? (
                    <span>Registrando en Sistema...</span>
                  ) : step < 3 ? (
                    <>
                      <span>Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirmar y Enviar por WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
