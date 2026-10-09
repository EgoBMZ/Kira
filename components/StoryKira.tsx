import Image from "next/image";
import { Sparkles, Heart, Trees, Users, ShieldCheck, Smile } from "lucide-react";

export default function StoryKira() {
  const pillars = [
    {
      icon: Trees,
      title: "Espacios 100% Campestres",
      desc: "Más de 3,000 m² de césped natural cercado con zonas arboladas para correr con total seguridad.",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: Users,
      title: "Socialización por Temperamento",
      desc: "Agrupamos a los perritos según su tamaño, energía y afinidad para garantizar amistades felices y cero estrés.",
      color: "text-sky-600 bg-sky-50",
    },
    {
      icon: Heart,
      title: "Amor Sin Jaulas ni Encierros",
      desc: "Trato cálido y familiar. Cada huésped duerme, juega y descansa sintiéndose protegido y querido.",
      color: "text-rose-600 bg-rose-50",
    },
    {
      icon: ShieldCheck,
      title: "Protocolos y Salud Veterinaria",
      desc: "Control estricto de esquemas de vacunación, botiquín de primeros auxilios y clínica aliada 24 horas.",
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <section id="conoce-a-kira" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Image of Kira with friends */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-sky-950/10 border-4 border-white ring-2 ring-sky-100 group">
              <Image
                src="/images/kira-friends.jpg"
                alt="Kira Husky Siberiano jugando con amigos en la guardería"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/80 backdrop-blur-md text-xs font-semibold mb-1">
                  <Smile className="w-3.5 h-3.5" /> Amistades que duran para siempre
                </span>
                <p className="text-sm font-medium text-slate-100">
                  Kira disfrutando en el parque de juegos junto a sus mejores amigos perrunos.
                </p>
              </div>
            </div>

            {/* Floating official logo badge */}
            <div className="mt-4 sm:absolute sm:-bottom-6 sm:-right-6 glass-card p-3.5 rounded-2xl shadow-xl border border-sky-100 max-w-xs text-left flex items-center gap-3 bg-white/95">
              <div className="relative w-16 h-16 bg-white p-1 rounded-2xl shadow-md border border-sky-100 shrink-0 ring-2 ring-sky-200">
                <Image
                  src="/images/kira-logo.png"
                  alt="Logo Oficial La Guardería de Kira"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-0.5">
                  {"★".repeat(5)}
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                  El Hogar de Kira 🐾
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Una casita con corazón donde cada colita canta de felicidad.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Nuestra Historia & Anfitriona</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
              Conoce a Kira: La Husky que inspiró este sueño
            </h2>

            <div className="space-y-4 text-slate-600 text-base leading-relaxed mb-8">
              <p>
                Kira es una perrita <strong className="text-slate-900 font-semibold">Husky Siberiano</strong> llena de energía, inteligencia y un corazón noble. Como su familia humana, comprendimos de primera mano que un perro no nació para pasar el día entero en cuatro paredes esperando que alguien llegue a casa.
              </p>
              <p>
                Los perros necesitan oler, explorar, saltar, jugar en manada y quemar su energía de forma positiva. Por eso decidimos crear <strong className="text-sky-700 font-semibold">La Guardería de Kira</strong>: un santuario campestre donde tratamos a cada perrito como si fuera el nuestro, respetando su personalidad y brindándole la mejor experiencia de su vida.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl ${pillar.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
