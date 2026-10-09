"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Phone,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tarifas", href: "#tarifas" },
    { name: "Requisitos", href: "#requisitos" },
    { name: "Pilares", href: "#pilares" },
    { name: "Ficha de Reserva", href: "#ficha-reserva" },
    { name: "Tienda", href: "#lemon-pup", isStore: true },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Top subtle notification bar */}
      <div className="bg-zinc-950 text-white text-xs py-2 px-4 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-bold border border-orange-500/30">
              📍 Barranquilla, Atlántico
            </span>
            <span className="text-zinc-300 font-medium text-xs hidden sm:inline">
              100% Libre de Jaulas • Aire Acondicionado 24/7 • 2 Paseos Diarios
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-400" /> 8:00 AM - 6:00 PM
            </span>
            <a
              href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Quisiera%20consultar%20disponibilidad%20en%20La%20Guarder%C3%ADa%20de%20Kira"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <Phone className="w-3 h-3" /> WhatsApp: 318 684 5602
            </a>
          </div>
        </div>
      </div>

      {/* Main Spacious & Elegant Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#fffaf5]/95 backdrop-blur-md shadow-sm border-b border-orange-200/60 py-3.5"
            : "bg-[#fffaf5] py-5 border-b border-orange-100/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Logo & Identity with breathing room */}
            <Link
              href="#inicio"
              className="flex items-center gap-3.5 group focus:outline-none shrink-0"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 shadow-sm border border-orange-200 ring-2 ring-orange-200/50 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <Image
                  src="/images/kira-logo.png"
                  alt="Logo Oficial La Guardería de Kira"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight leading-none">
                  La Guardería de Kira
                </span>
                <span className="text-xs font-bold text-orange-600 tracking-wide mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Barranquilla • Convivencia Familiar
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with generous breathing room */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    link.isStore
                      ? "bg-amber-100/80 text-amber-950 hover:bg-amber-200/80 border border-amber-200"
                      : "text-zinc-700 hover:text-zinc-950 hover:bg-orange-100/60"
                  }`}
                >
                  {link.isStore && <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Action pill button */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <a
                href="https://instagram.com/laguarderiadekira"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-zinc-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                title="Instagram Oficial (+4.5k seguidores)"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>+4.5k</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="pill-btn pill-btn-dark px-6 py-3 text-sm font-extrabold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Reservar Cupo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-zinc-800 hover:bg-orange-100 transition-colors"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-6 pt-4 pb-8 bg-[#fffaf5] border-b border-orange-200 shadow-xl space-y-4">
            <div className="flex flex-col gap-1.5 pb-4 border-b border-zinc-200">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-bold rounded-2xl transition-colors flex items-center justify-between ${
                    link.isStore
                      ? "bg-amber-100/70 text-amber-950 font-black"
                      : "text-zinc-800 hover:bg-orange-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isStore && <ShoppingBag className="w-4 h-4 text-amber-700" />}
                    {link.name}
                  </span>
                  <span className="text-zinc-400 text-xs">→</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-4 rounded-full pill-btn-dark font-black text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Cupo ($65.000 / 24h)</span>
              </button>

              <a
                href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Quisiera%20consultar%20disponibilidad%20en%20La%20Guarder%C3%ADa%20de%20Kira"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Hablar con Gabriel por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
