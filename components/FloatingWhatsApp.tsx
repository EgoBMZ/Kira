"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Pop-up bubble */}
      {isOpen && (
        <div className="bg-white p-3.5 rounded-2xl shadow-2xl border border-sky-100 max-w-xs text-left relative animate-bounce-subtle">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center text-xs"
            aria-label="Cerrar aviso"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="relative w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden ring-1 ring-sky-300 shrink-0">
              <Image
                src="/images/kira-logo.png"
                alt="Logo Oficial Kira"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                Gabriel • La Guardería de Kira
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Barranquilla • En línea
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            ¿Buscas cupo para tu peludo con <strong>A/C y 100% sin jaulas</strong>? ¡Escríbeme! 🐾
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Vengo%20de%20la%20p%C3%A1gina%20web%20y%20quiero%20conocer%20disponibilidad%20en%20La%20Guarder%C3%ADa%20de%20Kira"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        aria-label="Contactar por WhatsApp a Gabriel"
      >
        <MessageCircle className="w-7 h-7 fill-white group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
