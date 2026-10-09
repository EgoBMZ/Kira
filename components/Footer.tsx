import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Column 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-2xl bg-white p-1 ring-2 ring-orange-400 overflow-hidden shrink-0 shadow-md">
                <Image
                  src="/images/kira-logo.png"
                  alt="Logo Oficial La Guardería de Kira"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white tracking-tight leading-none">
                  La Guardería de Kira 🐾
                </h3>
                <p className="text-xs text-orange-400 font-semibold mt-1">
                  100% Libre de Jaulas con Aire Acondicionado
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Guardería canina con ambiente familiar en Barranquilla. Rutina activa con 2 paseos diarios al parque, descanso con aire acondicionado y reportes continuos por WhatsApp.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/laguarderiadekira"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-pink-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram Oficial"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://wa.me/573186845602?text=Hola%20Gabriel!%20Vengo%20de%20la%20p%C3%A1gina%20web%20de%20La%20Guarder%C3%ADa%20de%20Kira"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-emerald-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp Oficial"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
              <li>
                <Link href="#inicio" className="hover:text-orange-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#pilares" className="hover:text-orange-400 transition-colors">
                  Pilares Innegociables
                </Link>
              </li>
              <li>
                <Link href="#tarifas" className="hover:text-orange-400 transition-colors">
                  Tarifas ($65.000 / 24h)
                </Link>
              </li>
              <li>
                <Link href="#requisitos" className="hover:text-orange-400 transition-colors">
                  Requisitos de Admisión
                </Link>
              </li>
              <li>
                <Link href="#ficha-reserva" className="hover:text-orange-400 transition-colors">
                  Ficha Oficial (17 Datos)
                </Link>
              </li>
              <li>
                <Link href="#lemon-pup" className="hover:text-orange-400 transition-colors">
                  Gorras Lemon Pup Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operational Hours */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Horario Estricto
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div>
                <p className="font-bold text-zinc-200">Recepción & Entrega:</p>
                <p>8:00 a.m. a 6:00 p.m.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-200">Modalidad:</p>
                <p>Únicamente con reserva previa confirmada.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-200">Paseos al Parque:</p>
                <p>2 paseos diarios programados.</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Location in Barranquilla */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Atención Directa
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Barranquilla, Atlántico, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +57 318 684 5602</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Responsable de Atención:</span>
                <span className="font-bold text-zinc-200">Gabriel</span>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Capacidad: 20 cupos/día
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} La Guardería de Kira • Barranquilla, Colombia. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1">
              Inspirado en Kira, nuestra Husky Siberiano 🐾❄️
            </span>
            <Link
              href="/admin"
              className="text-zinc-600 hover:text-orange-400 transition-colors flex items-center gap-1"
              title="Panel de Administración"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
