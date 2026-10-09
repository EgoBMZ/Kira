import { ShieldCheck, Syringe, Bug, HeartHandshake, AlertCircle } from "lucide-react";

export default function AdmissionRequirements() {
  const requirements = [
    {
      icon: Syringe,
      title: "Vacunas al Día",
      desc: "Carnet vigente con Vacuna Múltiple/Séxtuple, Antirrábica y refuerzo de KC (Tos de las Perreras).",
      color: "bg-sky-50 text-sky-600",
    },
    {
      icon: Bug,
      title: "Desparasitación & Antipulgas",
      desc: "Desparasitación interna trimestral y protección externa activa (Simparica, Nexgard, Bravecto o pipeta).",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: HeartHandshake,
      title: "Día de Adaptación Gratuito",
      desc: "Una visita previa de 3 a 4 horas donde observamos su temperamento, nivel de juego e integración con la manada.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: ShieldCheck,
      title: "Perritos No Agresivos",
      desc: "Al ser un espacio 100% libre de jaulas, garantizamos que todos los miembros convivan en armonía y respeto.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seguridad & Salud Primero</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Requisitos para formar parte de la manada de Kira
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Cuidamos la salud y tranquilidad de cada perrito como si fuera el nuestro. Estos son nuestros estándares básicos:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {requirements.map((req) => {
            const Icon = req.icon;
            return (
              <div
                key={req.title}
                className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${req.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                  {req.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {req.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" />
            <p className="text-xs text-sky-900 font-medium">
              ¿Tu perrito es un cachorro o tiene necesidades especiales de medicación? ¡Coméntanoslo! Diseñamos planes adaptados.
            </p>
          </div>
          <a
            href="https://wa.me/573001234567?text=Hola!%20Quisiera%20consultar%20sobre%20los%20requisitos%20para%20ingresar%20a%20mi%20perrito"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
          >
            Consultar con un Asesor
          </a>
        </div>
      </div>
    </section>
  );
}
