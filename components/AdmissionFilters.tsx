"use client";

import {
  ShieldCheck,
  Syringe,
  Bug,
  HeartHandshake,
  AlertTriangle,
  XCircle,
  Sparkles,
  Utensils,
  Phone,
  Flame,
} from "lucide-react";

export default function AdmissionFilters() {
  const requirements = [
    {
      icon: Syringe,
      title: "Carné de Vacunación al Día",
      tag: "100% Obligatorio",
      tagColor: "bg-red-100 text-red-800",
      desc: "Esquema completo y vigente: Vacuna Séxtuple/Múltiple, Antirrábica y refuerzo de Tos de las Perreras (KC / Bordetella). Exigimos foto del carné previo al ingreso.",
      color: "bg-sky-100 text-sky-800",
    },
    {
      icon: Bug,
      title: "Antipulgas & Garrapatas Vigente",
      tag: "Bioseguridad Estricta",
      tagColor: "bg-emerald-100 text-emerald-800",
      desc: "Protección externa activa comprobable: NexGard (≤ 30 días), Bravecto (≤ 90 días) o Simparica + desparasitación interna reciente (< 3 meses). Cero parásitos en la manada.",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      icon: Flame,
      title: "Perritas NO en Celo / Calor",
      tag: "Armonía Grupal",
      tagColor: "bg-rose-100 text-rose-800",
      desc: "Estrictamente prohibido el ingreso en periodo de celo, sangrado o preñez. Una hembra en celo altera la dinámica y tranquilidad de toda la manada abierta sin jaulas.",
      color: "bg-rose-100 text-rose-800",
    },
    {
      icon: HeartHandshake,
      title: "Sociable & Cero Reactividad",
      tag: "Convivencia Familiar",
      tagColor: "bg-amber-100 text-amber-800",
      desc: "Aptos para compartir pacíficamente con otros perros y humanos. Cero antecedentes de mordidas o agresividad. No recibimos razas de manejo especial por seguridad del grupo.",
      color: "bg-orange-100 text-orange-800",
    },
    {
      icon: Utensils,
      title: "Alimento Propio en Porciones",
      tag: "Cuidado Digestivo",
      tagColor: "bg-purple-100 text-purple-800",
      desc: "Cada tutor debe traer el alimento exacto que consume en casa en bolsas herméticas o recipientes rotulados para evitar trastornos gastrointestinales durante la estadía.",
      color: "bg-purple-100 text-purple-800",
    },
    {
      icon: ShieldCheck,
      title: "Collar, Placa & Correa Segura",
      tag: "Paseos al Parque",
      tagColor: "bg-blue-100 text-blue-800",
      desc: "Collar o arnés con placa visible (nombre y teléfono) y correa resistente para sus 2 paseos diarios programados al parque con nuestro equipo.",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  return (
    <section id="requisitos" className="py-20 bg-white border-y border-orange-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider mb-4 border border-red-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-red-700" />
            <span>Filtros Sanitarios & Bioseguridad Estricta</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight mb-4">
            Requisitos de Admisión Innegociables
          </h2>
          <p className="text-base text-zinc-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Al ser un entorno <strong>100% libre de jaulas</strong> con aire acondicionado en Barranquilla, la bioseguridad y la armonía pacífica son innegociables. Sin excepciones, para proteger la salud de tu propio perro y de todos los huéspedes.
          </p>
        </div>

        {/* 6 Requisitos en Cuadrícula Armoniosa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {requirements.map((req) => {
            const Icon = req.icon;
            return (
              <div
                key={req.title}
                className="bg-[#fcfaf8] p-6 sm:p-7 rounded-3xl border border-orange-200/80 hover:border-orange-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${req.color} flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-black px-2.5 py-1 rounded-full ${req.tagColor}`}
                    >
                      {req.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-zinc-900 mb-2">
                    {req.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                    {req.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marco de Explicación y Transparencia: Por qué somos estrictos */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-7 sm:p-10 border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Izquierdo: Restricciones Claras */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" />
                <span>Norma Sanitaria y de Convivencia</span>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                ¿Qué perritos NO podemos aceptar?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Por la naturaleza abierta de nuestra guardería, no aceptamos:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Perritas en celo o sangrado activo:</strong> Inducen conductas territoriales y alteran la calma colectiva.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Perros con reactividad agresiva:</strong> Cero historial de mordeduras o agresividad hacia otros perros o personas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Razas de manejo especial:</strong> No admitidas (ej. Pitbull, Bull Terrier, etc. según Ley 1801 de 2016) debido a la convivencia libre sin jaulas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sin vacunas o antipulgas vigente:</strong> Protegemos a toda la manada contra virus y parásitos externos.
                  </span>
                </li>
              </ul>
            </div>

            {/* Lado Derecho: La Garantía para el Tutor */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 text-left space-y-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-lg text-white">
                Nuestra Garantía de Tranquilidad
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Somos tan estrictos porque cuando dejas a tu hijo perruno con nosotros, tienes la certeza de que todos los perritos a su alrededor están 100% sanos, desparasitados y sociabilizados.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Tengo%20una%20consulta%20sobre%20los%20requisitos%20de%20admisi%C3%B3n%20en%20La%20Guarder%C3%ADa%20de%20Kira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-6 py-3.5 flex items-center justify-center gap-2 w-full shadow-md"
                >
                  <Phone className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>Consultar Dudas con Gabriel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
