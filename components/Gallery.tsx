"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Maximize2, X } from "lucide-react";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryItems = [
    {
      src: "/images/kira-hero.jpg",
      title: "Kira lista para recibirte",
      subtitle: "Nuestra anfitriona Husky con su pañuelo característico en el jardín principal",
      tag: "Anfitriona Oficial",
    },
    {
      src: "/images/kira-friends.jpg",
      title: "Tardes de juegos en manada",
      subtitle: "Kira compartiendo túneles de agilidad con sus amigos Golden y Corgi",
      tag: "Socialización Segura",
    },
    {
      src: "/images/kira-hotel.jpg",
      title: "Suites de hotel acogedoras",
      subtitle: "Descanso reparador en camas ortopédicas con lucecitas cálidas y arrullo",
      tag: "Hotel 5 Estrellas",
    },
    {
      src: "/images/kira-bath.jpg",
      title: "Spa de burbujas & deslanado",
      subtitle: "Sesión de hidromasaje con coronita de espuma y champú dermatológico",
      tag: "Spa & Grooming",
    },
  ];

  return (
    <section id="galeria" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative starry / glowing background */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-3 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galería Animada de Kira & Sus Amigos</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Un vistazo al mundo de La Guardería de Kira
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Cada día es una nueva aventura llena de risas perrunas, bienestar y momentos entrañables.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer border-2 border-slate-800 hover:border-sky-400/80 transition-all duration-300 shadow-xl shadow-sky-950/40"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag Top */}
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/40 backdrop-blur-md">
                  {item.tag}
                </span>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <h3 className="font-heading font-bold text-base text-white mb-0.5 group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 p-2 sm:p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
              <Image
                src={galleryItems[selectedImage].src}
                alt={galleryItems[selectedImage].title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>

            <div className="px-3 pb-2 text-left">
              <span className="text-xs font-bold text-sky-400 block mb-1">
                {galleryItems[selectedImage].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white mb-1">
                {galleryItems[selectedImage].title}
              </h3>
              <p className="text-sm text-slate-300">
                {galleryItems[selectedImage].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
