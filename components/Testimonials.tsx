import { Star, Quote, Heart } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Camilo R. & Toby",
      dog: "Husky Siberiano (2 años)",
      avatarText: "🐺",
      rating: 5,
      comment:
        "Tener un Husky implica energía infinita. En otras guarderías me decían que era 'demasiado hiperactivo'. En La Guardería de Kira entienden su raza a la perfección: corre, juega con Kira y llega a casa súper equilibrado y feliz.",
      date: "Hace 2 semanas",
    },
    {
      name: "Valentina M. & Milo",
      dog: "Golden Retriever (1 año y medio)",
      avatarText: "🐕",
      rating: 5,
      comment:
        "Los reportes de fotos y videos diarios por WhatsApp son lo máximo. Ver a Milo corriendo por el pasto y chapoteando en la piscina mientras estoy trabajando no tiene precio. El personal es un amor de personas.",
      date: "Hace 1 mes",
    },
    {
      name: "Andrés D. & Lola",
      dog: "Bulldog Francés (3 años)",
      avatarText: "🐶",
      rating: 5,
      comment:
        "Como Lola es braquicéfala, me preocupaba el calor. Me encantó que tienen suites con clima controlado para la hora de la siesta y supervisión constante. Volvió oliendo delicioso gracias al spa.",
      date: "Hace 3 semanas",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Familias Felices</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Lo que dicen los papás de la manada
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Más de 250 colitas felices confían en nosotros semana a semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-sky-100 shadow-xl shadow-sky-950/5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-sky-200 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl shrink-0">
                  {t.avatarText}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {t.name}
                  </h4>
                  <p className="text-xs text-sky-700 font-medium">
                    {t.dog}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
