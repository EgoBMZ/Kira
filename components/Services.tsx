"use client";

import Image from "next/image";
import {
  Sun,
  Moon,
  Sparkles,
  Truck,
  Trophy,
  PartyPopper,
  Check,
  ArrowRight,
} from "lucide-react";

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const mainServices = [
    {
      id: "guarderia",
      title: "Guardería de Día Campestre",
      badge: "El Más Popular",
      badgeColor: "bg-sky-500 text-white",
      description:
        "Juegos al aire libre, socialización en manada por afinidad, recreos supervisados y descanso en suites climatizadas.",
      icon: Sun,
      iconColor: "text-amber-500 bg-amber-50",
      image: "/images/kira-friends.jpg",
      features: [
        "Jornada completa (7:00 am - 6:30 pm) o media jornada",
        "Socialización controlada según tamaño y energía",
        "Fotos y videos diarios enviados por WhatsApp",
        "Juegos de agility y piscina de pelotas",
      ],
      priceHint: "Desde $35.000 / día",
    },
    {
      id: "hotel",
      title: "Hotel Canino 5 Estrellas",
      badge: "Cuidado 24/7",
      badgeColor: "bg-indigo-600 text-white",
      description:
        "Hospedaje cálido sin jaulas. Suites acogedoras con camas ortopédicas, luz tenue, música relajante y cuidador nocturno.",
      icon: Moon,
      iconColor: "text-indigo-500 bg-indigo-50",
      image: "/images/kira-hotel.jpg",
      features: [
        "Habitaciones térmicas con camitas acolchadas",
        "Acompañamiento humano durante toda la noche",
        "Rutina de buenas noches y mimos relajantes",
        "Acceso a todas las actividades de la guardería",
      ],
      priceHint: "Desde $55.000 / noche",
    },
    {
      id: "spa",
      title: "Spa Canino & Deslanado",
      badge: "Especial Husky & Pelajes",
      badgeColor: "bg-cyan-600 text-white",
      description:
        "Baño con agua tibia, hidromasaje, champú dermatológico, deslanado profundo para muda y cepillado profesional.",
      icon: Sparkles,
      iconColor: "text-cyan-500 bg-cyan-50",
      image: "/images/kira-bath.jpg",
      features: [
        "Deslanado especializado en doble capa (Husky/Golden)",
        "Corte higiénico, uñas y limpieza ótica",
        "Aromaterapia relajante anti-estrés",
        "Perfumería suave hipoalergénica",
      ],
      priceHint: "Desde $40.000 según tamaño",
    },
  ];

  const extraServices = [
    {
      title: "Ruta Escolar Canina",
      desc: "Transporte puerta a puerta en vans climatizadas con arneses de seguridad y monitoreo en tiempo real.",
      icon: Truck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Agility & Estimulación Mental",
      desc: "Circuitos de obstáculos, juegos de olfato y acertijos caninos para canalizar energía e inteligencia.",
      icon: Trophy,
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "Cumpleaños Caninos",
      desc: "Festeja el día de tu consentido con snacks saludables aprobados, sesión fotográfica y gorritos para sus amigos.",
      icon: PartyPopper,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
            <span>🐾 Servicios Diseñados con Amor</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Todo lo que tu perro necesita para ser inmensamente feliz
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Desde pasadías campestres llenos de acción hasta noches acogedoras en suites de descanso, cada experiencia está pensada para su bienestar físico y emocional.
          </p>
        </div>

        {/* 3 Main Featured Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="glass-card rounded-3xl overflow-hidden border border-sky-100 flex flex-col hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Service Image with Badge */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${service.badgeColor}`}
                    >
                      {service.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`p-2.5 rounded-xl shadow-md ${service.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2.5 mb-6 border-t border-slate-100 pt-5">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                        Tarifa referencial
                      </span>
                      <span className="text-sm font-extrabold text-sky-700">
                        {service.priceHint}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-sky-600/30"
                    >
                      <span>Cotizar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Secondary Services Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {extraServices.map((extra) => {
            const Icon = extra.icon;
            return (
              <div
                key={extra.title}
                className="bg-white p-6 rounded-2xl border border-sky-100/80 shadow-sm flex items-start gap-4 hover:border-sky-200 transition-colors"
              >
                <div className={`p-3 rounded-2xl shrink-0 ${extra.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base mb-1">
                    {extra.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {extra.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
