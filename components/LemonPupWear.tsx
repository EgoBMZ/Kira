"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function LemonPupWear() {
  const [model, setModel] = useState<"Dog Mom" | "Dog Dad">("Dog Mom");
  const [selectedColor, setSelectedColor] = useState("Cream Marfil");

  const colors = [
    { name: "Cream Marfil", hex: "#f5f0eb", border: "border-zinc-300", text: "text-zinc-800" },
    { name: "Vino Tinto / Borgoña", hex: "#581825", border: "border-rose-900", text: "text-white" },
    { name: "Chocolate / Marrón", hex: "#3e2723", border: "border-amber-950", text: "text-white" },
    { name: "Beige Khaki", hex: "#c7b198", border: "border-amber-300", text: "text-zinc-900" },
    { name: "Azul Marino", hex: "#1a2a40", border: "border-slate-800", text: "text-white" },
    { name: "Blanco Pure", hex: "#ffffff", border: "border-zinc-300", text: "text-zinc-900" },
    { name: "Negro Classic", hex: "#18181b", border: "border-zinc-800", text: "text-white" },
  ];

  const currentColor = colors.find((c) => c.name === selectedColor) || colors[0];

  const getWhatsAppMessage = () => {
    const text = `¡Hola Gabriel! 🧢
Vi las gorras oficiales de Lemon Pup Wear en la web de La Guardería de Kira y me encantaría pedir una:
- Modelo: ${model}
- Color: ${selectedColor}

¿Tienen disponibilidad para entrega o recogida en el check-in?`;
    return `https://wa.me/573186845602?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="lemon-pup" className="py-16 sm:py-20 bg-white border-t border-orange-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            🍋 Lemon Pup Wear • Edición Limitada
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            Gorras Exclusivas para Pet Lovers
          </h2>
          <p className="text-base text-zinc-600 font-medium">
            Lleva con orgullo el amor por tu peludo con la línea oficial &ldquo;Dog Mom&rdquo; y &ldquo;Dog Dad&rdquo;. Disponibles en recepción al momento del check-in o para envío.
          </p>
        </div>

        {/* Product Showcase Card */}
        <div className="max-w-4xl mx-auto bg-[#fffaf5] rounded-[2.5rem] p-6 sm:p-10 border border-orange-200/80 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Cap Visual Mockup */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div
                className="w-full aspect-square max-w-sm rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-inner relative transition-colors duration-300 border border-black/5"
                style={{ backgroundColor: currentColor.hex }}
              >
                <span className="text-4xl mb-4">🧢</span>
                <span
                  className={`font-heading font-black text-3xl sm:text-4xl tracking-wider uppercase ${currentColor.text}`}
                >
                  {model}
                </span>
                <span className={`text-[11px] font-bold tracking-widest uppercase mt-2 opacity-80 ${currentColor.text}`}>
                  Lemon Pup Wear • Kira Edition
                </span>

                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-extrabold text-zinc-800 shadow-sm">
                  {selectedColor}
                </div>
              </div>
            </div>

            {/* Right Product Options */}
            <div className="md:col-span-6 space-y-6 text-left">
              {/* Select Model */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                  1. Selecciona tu Modelo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Dog Mom", "Dog Dad"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`py-3 px-4 rounded-2xl font-black text-sm transition-all cursor-pointer text-center ${
                        model === m
                          ? "bg-zinc-900 text-white shadow-sm scale-[1.02]"
                          : "bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {m === "Dog Mom" ? "🌸 Dog Mom" : "⚡ Dog Dad"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Color Swatch */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                  2. Selecciona el Color ({selectedColor})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? "bg-white border-zinc-900 shadow-sm ring-1 ring-zinc-900"
                          : "bg-white/60 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="truncate text-zinc-800">{c.name.split("/")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buy Button */}
              <div className="pt-2">
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full pill-btn pill-btn-dark py-4 text-sm font-black shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pedir mi Gorra {model} por WhatsApp</span>
                </a>
                <p className="text-[11px] text-zinc-500 text-center mt-2">
                  *Pregunta también por tu gorra física en recepción durante el check-in en Barranquilla.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
