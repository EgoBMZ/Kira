"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PillarsCarousel from "@/components/PillarsCarousel";
import PricingCalculator from "@/components/PricingCalculator";
import AdmissionFilters from "@/components/AdmissionFilters";
import OfficialBookingForm from "@/components/OfficialBookingForm";
import LemonPupWear from "@/components/LemonPupWear";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Sparkles, Calendar, Phone } from "lucide-react";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Hotel Canino 24h ($65.000 COP / día)");

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    const formSection = document.getElementById("ficha-reserva");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] selection:bg-orange-200 selection:text-orange-950 font-sans">
      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking("Hotel Canino 24h ($65.000 COP / día)")} />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 1. Hero Section: Mobile UX style + Kira flat illustration */}
        <Hero onOpenBooking={() => handleOpenBooking("Hotel Canino 24h ($65.000 COP / día)")} />

        {/* 2. Official 24-Hour Pricing Calculator & Payment Information (Top Prominence right after Hero) */}
        <PricingCalculator onOpenBooking={() => handleOpenBooking("Hotel Canino 24h ($65.000 COP / día)")} />

        {/* 3. Strict Non-negotiable Admission Requirements & Health Filters */}
        <AdmissionFilters />

        {/* 4. 4 Non-negotiable Pillars in Soft Pastel Carousel Cards */}
        <PillarsCarousel />

        {/* 5. Official 17-Data Booking Form */}
        <OfficialBookingForm />

        {/* Lemon Pup Wear: Dog Mom & Dog Dad Limited Edition Caps */}
        <LemonPupWear />

        {/* Call to Action Banner before FAQ */}
        <section className="py-14 bg-zinc-950 text-white relative overflow-hidden border-y border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-3 border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cupos Limitados • Máx 20 perros diarios</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                  ¿Listo para reservar el cupo de tu peludo en Barranquilla?
                </h2>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Recuerda que operamos <strong>únicamente con reserva previa confirmada</strong>. Habla directamente con Gabriel para apartar tus fechas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Quiero%20apartar%20un%20cupo%20en%20La%20Guarder%C3%ADa%20de%20Kira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3.5 text-sm font-extrabold shadow-md"
                >
                  <Phone className="w-4 h-4 fill-zinc-950" />
                  <span>WhatsApp con Gabriel</span>
                </a>

                <button
                  onClick={() => handleOpenBooking("Hotel Canino 24h ($65.000 COP / día)")}
                  className="pill-btn pill-btn-outline px-6 py-3.5 text-sm font-bold text-zinc-900"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Diligenciar Reserva</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions based on Master Manual */}
        <FAQ />
      </main>

      {/* Footer with Barranquilla location & Gabriel's official contact */}
      <Footer />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultService={selectedService}
      />

      {/* Floating WhatsApp chat widget */}
      <FloatingWhatsApp />
    </div>
  );
}
