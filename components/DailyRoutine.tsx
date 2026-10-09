"use client";

import { useState } from "react";
import { Clock, Sun, Moon, Sparkles, Activity, Coffee, HeartHandshake } from "lucide-react";

export default function DailyRoutine() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      time: "07:00 - 08:30",
      title: "Llegada & Olfateo de Bienvenida",
      icon: HeartHandshake,
      color: "from-sky-500 to-cyan-500",
      description:
        "Recepción con amor, revisión rápida de salud, aclimatación en la zona de bienvenida e hidratación con agua fresca de manantial.",
      detail:
        "Kira y el equipo reciben a cada peludo con alegría. Entran a la zona de olfateo para calmar cualquier ansiedad antes de integrarse al grupo.",
    },
    {
      time: "09:00 - 11:30",
      title: "Recreo Campestre & Agility",
      icon: Activity,
      color: "from-emerald-500 to-teal-500",
      description:
        "Carreras en más de 3,000 m² de césped, juegos con pelotas, túneles de agilidad y socialización guiada por tamaño.",
      detail:
        "El momento favorito de todos. Corren libres sin jaulas, queman energía sanamente y fortalecen lazos con sus amigos de manada.",
    },
    {
      time: "11:30 - 12:30",
      title: "Snack Saludable & Juegos de Olfato",
      icon: Coffee,
      color: "from-amber-500 to-orange-500",
      description:
        "Hidratación, snacks 100% naturales aprobados por veterinario y actividades de enriquecimiento cognitivo.",
      detail:
        "En días calurosos ofrecemos paleticas de caldo canino o frutas seguras, alfombras de olfato y retos que estimulan su cerebro.",
    },
    {
      time: "12:30 - 14:30",
      title: "Siesta Zen en Suites Climatizadas",
      icon: Moon,
      color: "from-indigo-500 to-purple-500",
      description:
        "Descanso profundo en camas ortopédicas suaves con música instrumental relajante y temperatura controlada.",
      detail:
        "Fundamental para evitar fatiga o sobre-estimulación. Duermen acompañados, bajo luz cálida y ambiente súper silencioso.",
    },
    {
      time: "14:30 - 16:30",
      title: "Piscina de Pelotas & Chapoteo",
      icon: Sun,
      color: "from-cyan-500 to-blue-500",
      description:
        "Juegos acuáticos moderados en piscina especial para perros, dinámicas grupales con frisbees y juguetes blandos.",
      detail:
        "Perfecto para refrescarse y disfrutar de una tarde divertida y dinámica con supervisión uno a uno.",
    },
    {
      time: "16:30 - 18:30",
      title: "Spa Express & Entrega a Papás",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      description:
        "Cepillado relajante, limpieza de patitas, perfume hipoalergénico y reporte fotográfico final en WhatsApp.",
      detail:
        "Tu consentido vuelve a casa limpio, relajado, con rico aroma y con la satisfacción de haber vivido un día extraordinario.",
    },
  ];

  return (
    <section id="rutina" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Un Día Mágico en la Guardería</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            ¿Cómo vive su día tu perrito con nosotros?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Una rutina estructurada que combina ejercicio vigoroso, enriquecimiento mental, descanso reparador y afecto incondicional.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = activeStep === index;
            return (
              <div
                key={step.time}
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer text-left relative flex flex-col justify-between ${
                  isCurrent
                    ? "bg-sky-50/60 border-sky-300 shadow-xl shadow-sky-500/10 scale-[1.02]"
                    : "bg-slate-50/80 border-slate-100 hover:border-sky-200 hover:bg-white"
                }`}
              >
                <div>
                  {/* Step time & number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white shadow-sm border border-slate-100 text-slate-700">
                      <Clock className="w-3 h-3 text-sky-600" />
                      {step.time}
                    </span>
                    <span className="text-xs font-extrabold text-slate-300">
                      Paso 0{index + 1}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Detail pill */}
                <div className="pt-3 border-t border-slate-200/60 text-xs text-sky-900 font-medium">
                  {step.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
