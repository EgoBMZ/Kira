"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Dónde están ubicados y cuál es el horario de check-in / check-out?",
      a: "Estamos ubicados en Barranquilla, Atlántico. El horario estricto para recepción y entrega de mascotas es de 8:00 a.m. a 6:00 p.m., sin excepciones, para garantizar la tranquilidad y descanso de la manada. Operamos únicamente con reserva previa confirmada.",
    },
    {
      q: "¿Cómo se calcula la tarifa de 24 horas y las horas adicionales?",
      a: "La tarifa de hotel es de $65.000 COP por cada 24 horas. El ciclo se audita estrictamente a partir de la hora exacta en la que tu perrito ingresa a la guardería. Pasadas las 24 horas, se aplica un cobro modular de $10.000 COP por cada hora adicional hasta completar el valor de un nuevo día ($65.000 COP). Además, si contratas 7 días continuos, ¡el séptimo día es 100% GRATIS (Promo 7x6)!",
    },
    {
      q: "¿Cómo manejan el calor de Barranquilla?",
      a: "Nuestras zonas de descanso cuentan con climatización total (Aire Acondicionado 24/7). Esto garantiza que los perritos descansen frescos, cómodos y seguros, amortiguando completamente las altas temperaturas de la ciudad. Además, realizamos 2 paseos diarios al parque en horarios adecuados.",
    },
    {
      q: "¿Qué debe traer mi perrito para su estadía?",
      a: "Para mayor comodidad tuya y orden sanitario, debes traer EXCLUSIVAMENTE su comida habitual (en porciones medidas para cada día) y su correa de paseo. No es necesario traer camas, platos ni juguetes; nosotros proveemos todo en óptimas condiciones higiénicas.",
    },
    {
      q: "¿Qué vacunas y protecciones sanitarias son obligatorias?",
      a: "Es obligatorio presentar foto legible del carné de vacunación al día (Séxtuple, Rabia y Tos de las Perreras / KC), desparasitación interna reciente y protección externa comprobable contra garrapatas y pulgas (NextGard ≤ 30 días o Bravecto ≤ 90 días).",
    },
    {
      q: "¿Por qué no admiten perritas en celo ni razas de manejo especial?",
      a: "Al ser un espacio 100% libre de jaulas con convivencia abierta, la armonía y la seguridad biológica y física de todos los perros es innegociable. No admitimos hembras en calor/celo ni perros con antecedentes de mordida o reactividad grupal, ni razas de manejo especial (ej. Pitbulls). Perritos enérgicos y cachorros son totalmente bienvenidos.",
    },
    {
      q: "¿Cuáles son los métodos de pago para apartar el cupo?",
      a: "Para asegurar formalmente el cupo, se debe transferir a nuestra cuenta de ahorros Bancolombia No. 55469943363 o vía Llave Transfiya / Bancolombia @luis8480, enviando el comprobante a Gabriel por WhatsApp (+57 318 684 5602).",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            Preguntas Frecuentes
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            Políticas & Respuestas Oficiales
          </h2>
          <p className="text-base text-zinc-600 font-medium">
            Todo lo que necesitas saber según nuestro Manual Operativo Maestro.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left bg-white hover:bg-orange-50/40 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="font-heading font-black text-base text-zinc-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 leading-relaxed bg-white border-t border-zinc-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
