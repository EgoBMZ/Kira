"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Send, Phone, CheckCircle2, Sparkles, Calendar } from "lucide-react";

import { createBooking } from "@/lib/bookings";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  defaultService = "Hotel Canino 24h ($65.000 COP / día)",
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    dogName: "",
    dogBreed: "",
    dogAge: "",
    service: defaultService,
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedId, setSavedId] = useState("");

  if (!isOpen) return null;

  const handleWhatsAppDirect = (refId?: string) => {
    const refText = refId ? ` (Ref: #${refId.slice(0, 8)})` : "";
    const text = `¡Hola Gabriel! 🐾${refText}
Vengo de la página web de La Guardería de Kira (Barranquilla) y quiero solicitar reserva:
- Tutor: ${formData.ownerName || "No especificado"}
- Teléfono: ${formData.phone || "No especificado"}
- Perrito: ${formData.dogName || "Peludo"} (${formData.dogBreed || "Raza no especificada"}, ${formData.dogAge || "Edad no especificada"})
- Modalidad: ${formData.service}
- Notas: ${formData.notes || "Ninguna"}

¿Tienes cupo disponible para estas fechas?`;

    window.open(
      `https://wa.me/573186845602?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let docId = "";
    try {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      docId = await createBooking({
        petName: formData.dogName.trim() || "Peludo",
        petBreed: formData.dogBreed.trim() || "Sin especificar",
        petAge: formData.dogAge.trim() || "Sin especificar",
        isNeutered: "Sí",
        inHeat: "No",
        isSociable: "Sí, es sociable",
        checkInDate: today,
        checkInTime: "09:00",
        checkOutDate: tomorrowStr,
        checkOutTime: "12:00",
        daysCount: 1,
        extraHours: 0,
        totalAmount: 65000,
        foodSchedule: "Habitual",
        specialNotes: `Servicio: ${formData.service}. Notas: ${formData.notes.trim() || "Ninguna"}`,
        ownerName: formData.ownerName.trim() || "Tutor",
        ownerPhone: formData.phone.trim() || "",
        ownerId: "",
        instagramUser: "",
        ownerAddress: "Barranquilla",
        status: "pending",
      });
      setSavedId(docId);
    } catch (err) {
      console.warn("No se pudo guardar en Firestore desde modal:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      handleWhatsAppDirect(docId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-white p-1 overflow-hidden ring-2 ring-white/50 shrink-0">
              <Image
                src="/images/kira-logo.png"
                alt="Logo Oficial La Guardería de Kira"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
                La Guardería de Kira
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                {submitted ? "¡Solicitud Recibida!" : "Agenda tu Visita o Reserva"}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-heading font-extrabold text-2xl text-slate-900 mb-2">
                ¡Gracias por escribirnos! 🐾
              </h4>
              <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
                Kira y nuestro equipo se comunicarán contigo vía WhatsApp en menos de 15 minutos para coordinar los detalles de tu peludo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleWhatsAppDirect(savedId)}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Abrir WhatsApp Ahora
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +57 300 123 4567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Perrito *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Toby"
                    value={formData.dogName}
                    onChange={(e) =>
                      setFormData({ ...formData, dogName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Raza *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Husky, Mestizo..."
                    value={formData.dogBreed}
                    onChange={(e) =>
                      setFormData({ ...formData, dogBreed: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Edad Aproximada
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 1 año, 8 meses"
                    value={formData.dogAge}
                    onChange={(e) =>
                      setFormData({ ...formData, dogAge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Servicio de Interés
                </label>
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none bg-white transition-all"
                >
                  <option value="Hotel Canino 24h ($65.000 COP / día)">
                    🏨 Hotel Canino 24h ($65.000 COP / día con A/C)
                  </option>
                  <option value="Larga Estancia - Promo 7x6 (1 día gratis)">
                    🎁 Larga Estancia - Promo 7x6 (Paga 6, 1 día GRATIS)
                  </option>
                  <option value="Día Ocasional con A/C">
                    ❄️ Guardería Diaria con A/C y 2 Paseos al Parque
                  </option>
                  <option value="Consulta sobre Requisitos o Disponibilidad">
                    ❓ Consulta sobre Requisitos o Disponibilidad
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comentarios o Requerimientos Especiales
                </label>
                <textarea
                  rows={2}
                  placeholder="¿Algún cuidado especial, timidez con otros perros, alimentación o fecha estimada?"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Registrando en Sistema..." : "Enviar Formulario"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppDirect()}
                  className="py-3.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Chatear Directo</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
