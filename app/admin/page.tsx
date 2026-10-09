"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider, SUPER_ADMIN_EMAIL } from "@/lib/firebase";
import {
  SettingsConfig,
  DEFAULT_SETTINGS,
  saveSettings,
  subscribeSettings,
} from "@/lib/settings";
import {
  Booking,
  subscribeBookings,
  updateBookingStatus,
  createGoogleCalendarUrl,
} from "@/lib/bookings";
import {
  subscribeAuthorizedAdmins,
  addAdminEmail,
  removeAdminEmail,
  isEmailAdmin,
} from "@/lib/admin-auth";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Phone,
  Save,
  Sliders,
  CalendarCheck,
  ListOrdered,
  UserCheck,
  UserX,
  UserPlus,
  Crown,
} from "lucide-react";

export default function AdminPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Admin access control state
  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>([
    SUPER_ADMIN_EMAIL.toLowerCase(),
  ]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [newAdminInput, setNewAdminInput] = useState("");
  const [adminActionMsg, setAdminActionMsg] = useState("");

  // App data state
  const [settings, setSettings] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"calendar" | "rates" | "bookings" | "admins">("calendar");

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);

  // Booking search/filter
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Day override modal / inline state
  const [tempCustomCap, setTempCustomCap] = useState<string>("");

  // 1. Escuchar lista de administradores autorizados
  useEffect(() => {
    const unsubAdmins = subscribeAuthorizedAdmins((list) => {
      setAuthorizedAdmins(list);
    });
    return () => unsubAdmins();
  }, []);

  // 2. Escuchar sesión de Firebase Auth y verificar rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        const hasAccess = isEmailAdmin(user.email, authorizedAdmins);
        setIsAdminUser(hasAccess);
        if (!hasAccess) {
          setAuthError(
            `El correo ${user.email} no tiene permisos de administrador. Contacta al administrador principal (${SUPER_ADMIN_EMAIL}).`
          );
        } else {
          setAuthError("");
        }
      } else {
        setIsAdminUser(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [authorizedAdmins]);

  // 3. Escuchar configuración y reservas en tiempo real si es admin
  useEffect(() => {
    if (!currentUser || !isAdminUser) return;

    const unsubSettings = subscribeSettings((newSettings) => {
      setSettings(newSettings);
      setSettingsForm(newSettings);
    });

    const unsubBookings = subscribeBookings((newBookings) => {
      setBookings(newBookings);
    });

    return () => {
      unsubSettings();
      unsubBookings();
    };
  }, [currentUser, isAdminUser]);

  // Iniciar sesión exclusivamente con Google
  const handleGoogleSignIn = async () => {
    setAuthError("");
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error(err);
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/popup-closed-by-user") {
        setAuthError("Inicio de sesión cancelado en la ventana emergente.");
      } else if (error.code === "auth/operation-not-allowed") {
        setAuthError("El proveedor de Google no está habilitado en tu Firebase Console. Sigue el instructivo en context/INSTRUCTIVO_REGLAS_FIREBASE.md para activarlo.");
      } else {
        setAuthError(error.message || "Error al autenticar con Google.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setAuthError("");
  };

  // Agregar nuevo administrador
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionMsg("");
    try {
      await addAdminEmail(newAdminInput);
      setAdminActionMsg(`¡Administrador ${newAdminInput} agregado con éxito!`);
      setNewAdminInput("");
      setTimeout(() => setAdminActionMsg(""), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert(error.message || "Error al agregar administrador.");
    }
  };

  // Eliminar administrador (protegido contra superadmin)
  const handleRemoveAdmin = async (emailToRemove: string) => {
    if (confirm(`¿Seguro que deseas revocar los permisos de ${emailToRemove}?`)) {
      try {
        await removeAdminEmail(emailToRemove);
      } catch (err: unknown) {
        const error = err as { message?: string };
        alert(error.message || "No se puede eliminar este administrador.");
      }
    }
  };

  // Guardar configuración en Firestore
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      await saveSettings(settingsForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error al guardar configuración:", err);
      alert("Hubo un error al guardar en Firestore.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Alternar bloqueo de fecha en el calendario
  const toggleBlockDate = async (dateStr: string) => {
    const currentBlocked = settings.blockedDates || [];
    let updated: string[];
    if (currentBlocked.includes(dateStr)) {
      updated = currentBlocked.filter((d) => d !== dateStr);
    } else {
      updated = [...currentBlocked, dateStr];
    }
    const newSettings = { ...settings, blockedDates: updated };
    setSettings(newSettings);
    setSettingsForm(newSettings);
    await saveSettings({ blockedDates: updated });
  };

  // Guardar aforo personalizado para una fecha (ej. temporada alta)
  const handleSetCustomCapacity = async (dateStr: string) => {
    const num = parseInt(tempCustomCap, 10);
    const customCapacities = { ...(settings.customCapacities || {}) };
    if (isNaN(num) || num <= 0) {
      delete customCapacities[dateStr];
    } else {
      customCapacities[dateStr] = num;
    }
    const newSettings = { ...settings, customCapacities };
    setSettings(newSettings);
    setSettingsForm(newSettings);
    await saveSettings({ customCapacities });
    setTempCustomCap("");
  };

  // Cambiar estado de reserva
  const handleUpdateStatus = async (bookingId: string, status: Booking["status"]) => {
    try {
      await updateBookingStatus(bookingId, status);
    } catch (err) {
      console.error("Error actualizando reserva:", err);
      alert("No se pudo actualizar el estado.");
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-zinc-600">Verificando credenciales de La Guardería de Kira...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o su correo no es administrador
  if (!currentUser || !isAdminUser) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex flex-col justify-center items-center p-4 selection:bg-orange-200">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-orange-200/80 shadow-2xl relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4 border border-orange-200 shadow-xs">
            <ShieldCheck className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="font-heading text-2xl font-black text-zinc-900 tracking-tight">
            Panel Administrativo
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-1 mb-6">
            Acceso exclusivo para administradores de La Guardería de Kira
          </p>

          {authError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 text-left flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span>{authError}</span>
                {currentUser && (
                  <button
                    onClick={handleSignOut}
                    className="block mt-2 underline text-rose-900 hover:text-rose-950 font-black cursor-pointer"
                  >
                    Cerrar sesión actual
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Botón Exclusivo de Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 text-zinc-800 font-extrabold text-sm transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {/* SVG Logo oficial de Google */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? "Conectando con Google..." : "Iniciar Sesión con Google"}</span>
          </button>

          <p className="text-[11px] text-zinc-400 mt-4">
            Solo cuentas autorizadas como <strong className="text-zinc-600">{SUPER_ADMIN_EMAIL}</strong> tienen permiso de acceso.
          </p>

          <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-center">
            <Link
              href="/"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
            >
              <span>Volver al sitio web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Métricas de Aforo Rápidas para Hoy ---
  const todayStr = new Date().toISOString().split("T")[0];
  const activeToday = bookings.filter(
    (b) => b.status !== "cancelled" && b.checkInDate <= todayStr && todayStr <= b.checkOutDate
  );
  const checkInsToday = bookings.filter(
    (b) => b.status !== "cancelled" && b.checkInDate === todayStr
  );
  const checkOutsToday = bookings.filter(
    (b) => b.status !== "cancelled" && b.checkOutDate === todayStr
  );
  const todayCapacity =
    settings.customCapacities?.[todayStr] !== undefined
      ? settings.customCapacities[todayStr]
      : settings.standardCapacity;

  // Determinar si el usuario autenticado es el Super Admin inmutable
  const isSuperAdmin = currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  // --- Lógica del Calendario de Ocupación ---
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Lunes = 0

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Reservas filtradas para la pestaña de lista
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchPet = b.petName?.toLowerCase().includes(term);
      const matchOwner = b.ownerName?.toLowerCase().includes(term);
      const matchPhone = b.ownerPhone?.toLowerCase().includes(term);
      return matchPet || matchOwner || matchPhone;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-zinc-900 pb-16 selection:bg-orange-200">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-orange-200/70 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-base sm:text-lg text-zinc-900 leading-tight">
                  La Guardería de Kira
                </h1>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>Super Admin</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-500 block truncate max-w-[200px] sm:max-w-xs">
                {currentUser.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Ver Sitio Web</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Huéspedes Hoy</span>
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900">
                {activeToday.length}
              </span>
              <span className="text-xs font-bold text-zinc-500">/ {todayCapacity} cupos</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Entradas Hoy</span>
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {checkInsToday.length}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Salidas Hoy</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {checkOutsToday.length}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Tarifa Oficial 24h</span>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-900">
              ${settings.ratePer24h.toLocaleString("es-CO")}
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex bg-zinc-200/70 p-1 rounded-2xl mb-6 max-w-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "calendar"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-orange-600" />
            <span>Calendario & Aforo</span>
          </button>

          <button
            onClick={() => setActiveTab("rates")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "rates"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Sliders className="w-4 h-4 text-orange-600" />
            <span>Tarifas & Horarios</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "bookings"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ListOrdered className="w-4 h-4 text-orange-600" />
            <span>Reservas ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "admins"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Users className="w-4 h-4 text-orange-600" />
            <span>Administradores ({authorizedAdmins.length})</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: CALENDARIO INTERACTIVO & AFORO (GOOGLE CALENDAR STYLE)         */}
        {/* ==================================================================== */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-orange-200/80 shadow-sm">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-zinc-900">
                    {monthNames[month]} {year}
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                    Toca cualquier día para bloquear/desbloquear o ajustar cupo extraordinario de temporada.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers (Lunes a Domingo) */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-black uppercase text-zinc-500 mb-2">
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
                <div>Dom</div>
              </div>

              {/* Grid of Calendar Days */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Empty prefix slots */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] rounded-2xl bg-zinc-50/50 border border-transparent opacity-40" />
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const isBlocked = settings.blockedDates?.includes(dateStr);
                  const capacity =
                    settings.customCapacities?.[dateStr] !== undefined
                      ? settings.customCapacities[dateStr]
                      : settings.standardCapacity;

                  // Active dogs this day
                  const activeOnDay = bookings.filter(
                    (b) => b.status !== "cancelled" && b.checkInDate <= dateStr && dateStr <= b.checkOutDate
                  );
                  const isToday = dateStr === todayStr;
                  const isFull = activeOnDay.length >= capacity;
                  const isSelected = selectedDayDetail === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDayDetail(isSelected ? null : dateStr)}
                      className={`min-h-[70px] sm:min-h-[95px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                        isSelected
                          ? "ring-2 ring-orange-500 border-orange-500 shadow-md bg-orange-50/40"
                          : isBlocked
                          ? "bg-zinc-100 border-zinc-200 text-zinc-400 opacity-70"
                          : isFull
                          ? "bg-rose-50/80 border-rose-200 text-zinc-900"
                          : activeOnDay.length > 0
                          ? "bg-emerald-50/50 border-emerald-200 text-zinc-900"
                          : "bg-white border-zinc-200/80 hover:border-orange-300 hover:bg-orange-50/20 text-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs sm:text-sm font-black ${isToday ? "w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px]" : ""}`}>
                          {dayNum}
                        </span>
                        {isBlocked ? (
                          <Lock className="w-3 h-3 text-rose-500" />
                        ) : isFull ? (
                          <span className="text-[9px] font-black uppercase text-rose-600">Lleno</span>
                        ) : null}
                      </div>

                      <div className="mt-1">
                        {isBlocked ? (
                          <span className="text-[10px] font-bold text-rose-600 block">Cerrado</span>
                        ) : (
                          <div className="text-[10px] sm:text-xs font-extrabold flex items-center justify-between">
                            <span className={activeOnDay.length > 0 ? "text-emerald-700" : "text-zinc-500"}>
                              {activeOnDay.length}/{capacity}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-medium hidden sm:inline">perros</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Day Inspector & Action Drawer when a day is selected */}
              {selectedDayDetail && (
                <div className="mt-6 p-5 rounded-2xl bg-orange-50/70 border border-orange-200 text-zinc-900 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-200/60">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-orange-800">
                        Gestión del Día
                      </span>
                      <h3 className="font-heading font-black text-xl text-zinc-900">
                        {selectedDayDetail}
                      </h3>
                      <p className="text-xs text-zinc-600">
                        Capacidad actual:{" "}
                        <strong>
                          {settings.customCapacities?.[selectedDayDetail] !== undefined
                            ? `${settings.customCapacities[selectedDayDetail]} perros (Especial)`
                            : `${settings.standardCapacity} perros (Estándar)`}
                        </strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBlockDate(selectedDayDetail)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                          settings.blockedDates?.includes(selectedDayDetail)
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-rose-600 hover:bg-rose-500 text-white"
                        }`}
                      >
                        {settings.blockedDates?.includes(selectedDayDetail) ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Abrir Día</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Bloquear / Cerrar Día</span>
                          </>
                        )}
                      </button>

                      {/* Custom capacity input */}
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-orange-200">
                        <input
                          type="number"
                          placeholder="Aforo..."
                          value={tempCustomCap}
                          onChange={(e) => setTempCustomCap(e.target.value)}
                          className="w-16 px-2 py-1 text-xs font-bold text-zinc-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetCustomCapacity(selectedDayDetail)}
                          className="px-2.5 py-1 bg-zinc-950 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 cursor-pointer"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dogs staying on selectedDayDetail */}
                  <div className="pt-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700 mb-2">
                      Huéspedes Programados para esta fecha:
                    </h4>
                    {bookings.filter(
                      (b) =>
                        b.status !== "cancelled" &&
                        b.checkInDate <= selectedDayDetail &&
                        selectedDayDetail <= b.checkOutDate
                    ).length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No hay perros registrados para este día.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {bookings
                          .filter(
                            (b) =>
                              b.status !== "cancelled" &&
                              b.checkInDate <= selectedDayDetail &&
                              selectedDayDetail <= b.checkOutDate
                          )
                          .map((b) => (
                            <div
                              key={b.id}
                              className="p-3 rounded-xl bg-white border border-orange-200/80 shadow-xs text-xs"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-black text-zinc-900">🐶 {b.petName}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                  {b.status}
                                </span>
                              </div>
                              <p className="text-zinc-600 text-[11px]">
                                {b.petBreed} • Tutor: {b.ownerName}
                              </p>
                              <p className="text-zinc-500 text-[10px] mt-1">
                                📅 {b.checkInDate} ({b.checkInTime}) ➔ {b.checkOutDate} ({b.checkOutTime})
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PARAMETRIZACIÓN DE TARIFAS & HORARIOS OFICIALES               */}
        {/* ==================================================================== */}
        {activeTab === "rates" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-6 border-b border-zinc-100 mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Valores del Negocio
                </span>
                <h2 className="font-heading font-black text-2xl text-zinc-900">
                  Tarifas, Horarios & Capacidad
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Cualquier cambio aquí actualizará al instante la calculadora pública y el formulario de clientes.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Guardado en Firebase!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Tarifa 24h & Tarifa Hora Extra */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Tarifa Base por Ciclo de 24h ($ COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-zinc-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      value={settingsForm.ratePer24h}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, ratePer24h: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border border-zinc-200 text-sm font-black text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Por defecto: $65.000 COP</span>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Tarifa por Hora Adicional ($ COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-zinc-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      value={settingsForm.ratePerExtraHour}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, ratePerExtraHour: Number(e.target.value) })
                      }
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border border-zinc-200 text-sm font-black text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Por defecto: $10.000 COP/h</span>
                </div>
              </div>

              {/* Ventana de Atención & Capacidad Estándar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Hora Apertura (Check-in)
                  </label>
                  <input
                    type="time"
                    required
                    value={settingsForm.checkInWindowStart}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, checkInWindowStart: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">Oficial: 08:00 AM</span>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Hora Cierre (Check-out)
                  </label>
                  <input
                    type="time"
                    required
                    value={settingsForm.checkInWindowEnd}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, checkInWindowEnd: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">Oficial: 06:00 PM</span>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                    Capacidad Base (Perros)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={settingsForm.standardCapacity}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, standardCapacity: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 text-sm font-black text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">Por defecto: 20 perros</span>
                </div>
              </div>

              {/* Promo 7x6 Toggle */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-sm text-zinc-900">
                    🎁 Promoción 7x6 (1 Día Gratis cada 7 días)
                  </h4>
                  <p className="text-xs text-zinc-600">
                    Aplica automáticamente el descuento en estancias consecutivas mayores a 7 días.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.promo7x6Enabled}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, promo7x6Enabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              {/* Días laborales de la semana */}
              <div className="pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-2">
                  Días Operativos de Atención
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {[
                    { day: 1, name: "Lun" },
                    { day: 2, name: "Mar" },
                    { day: 3, name: "Mié" },
                    { day: 4, name: "Jue" },
                    { day: 5, name: "Vie" },
                    { day: 6, name: "Sáb" },
                    { day: 0, name: "Dom" },
                  ].map(({ day, name }) => {
                    const isActive = settingsForm.workingDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const current = settingsForm.workingDays || [];
                          const updated = isActive
                            ? current.filter((d) => d !== day)
                            : [...current, day];
                          setSettingsForm({ ...settingsForm, workingDays: updated });
                        }}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isActive
                            ? "bg-zinc-950 text-white shadow-xs"
                            : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón Guardar */}
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? "Guardando en Firebase..." : "Guardar Parámetros en Firebase"}</span>
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: GESTIÓN DE RESERVAS ENTRANTES                                */}
        {/* ==================================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {/* Search & Status Filters */}
            <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar perro, dueño o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                      statusFilter === st
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {st === "all" ? "Todas" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List Cards */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-orange-200/80">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  🐾
                </div>
                <h3 className="font-heading font-black text-lg text-zinc-900">
                  No hay reservas registradas
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Las solicitudes enviadas desde la página web aparecerán aquí en tiempo real.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((b) => {
                  const calUrl = createGoogleCalendarUrl({
                    title: `🐾 Guardería Kira: ${b.petName} (${b.ownerName})`,
                    details: `Huésped: ${b.petName} (${b.petBreed}, ${b.petAge})\nTutor: ${b.ownerName} (${b.ownerPhone})\nTotal: $${b.totalAmount.toLocaleString("es-CO")} COP\nNotas: ${b.specialNotes || "Ninguna"}`,
                    startDate: b.checkInDate,
                    startTime: b.checkInTime || "09:00",
                    endDate: b.checkOutDate,
                    endTime: b.checkOutTime || "17:00",
                  });

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:border-orange-300 transition-all text-zinc-900"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Pet & Owner main info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-lg text-zinc-900">
                              🐶 {b.petName}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                b.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : b.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-600 font-medium">
                            {b.petBreed} • {b.petAge} • Esterilizado: {b.isNeutered} • Sociable: {b.isSociable}
                          </p>

                          <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                            <span>
                              <strong>Tutor:</strong> {b.ownerName}
                            </span>
                            <span>
                              <strong>WhatsApp:</strong> {b.ownerPhone}
                            </span>
                            {b.instagramUser && (
                              <span>
                                <strong>IG:</strong> @{b.instagramUser.replace("@", "")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stay Dates & Cost */}
                        <div className="bg-[#fffaf5] p-3.5 rounded-xl border border-orange-200/60 lg:text-right shrink-0">
                          <div className="text-xs font-bold text-zinc-700">
                            📅 {b.checkInDate} ({b.checkInTime}) ➔ {b.checkOutDate} ({b.checkOutTime})
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {b.daysCount} días de 24h + {b.extraHours}h extras
                          </div>
                          <div className="text-base font-black text-orange-600 mt-1">
                            ${b.totalAmount.toLocaleString("es-CO")} COP
                          </div>
                        </div>
                      </div>

                      {/* Notes / Special requirements if any */}
                      {b.specialNotes && (
                        <p className="mt-3 p-2.5 rounded-lg bg-zinc-50 text-[11px] text-zinc-600 border border-zinc-100">
                          <strong>Notas:</strong> {b.specialNotes}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                        {/* WhatsApp & Google Calendar link */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${b.ownerPhone?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 fill-zinc-950" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={calUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-xs font-bold text-zinc-700 flex items-center gap-1.5 transition-colors"
                          >
                            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span>Agendar en Google Calendar</span>
                          </a>
                        </div>

                        {/* Status updates */}
                        <div className="flex items-center gap-1.5">
                          {b.status !== "confirmed" && (
                            <button
                              onClick={() => b.id && handleUpdateStatus(b.id, "confirmed")}
                              className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}
                          {b.status !== "completed" && b.status === "confirmed" && (
                            <button
                              onClick={() => b.id && handleUpdateStatus(b.id, "completed")}
                              className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold cursor-pointer"
                            >
                              Completar
                            </button>
                          )}
                          {b.status !== "cancelled" && (
                            <button
                              onClick={() => b.id && handleUpdateStatus(b.id, "cancelled")}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: GESTIÓN DE ADMINISTRADORES                                   */}
        {/* ==================================================================== */}
        {activeTab === "admins" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-sm max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                Control de Acceso
              </span>
              <h2 className="font-heading font-black text-2xl text-zinc-900">
                Equipo de Administradores
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Solo los usuarios con cuentas de Google listadas aquí pueden ingresar a gestionar el negocio.
              </p>
            </div>

            {adminActionMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{adminActionMsg}</span>
              </div>
            )}

            {/* Agregar nuevo admin (Solo Super Admin) */}
            {isSuperAdmin ? (
              <form onSubmit={handleAddAdmin} className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
                <h4 className="font-heading font-black text-sm text-zinc-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-orange-600" />
                  <span>Autorizar Nuevo Administrador con Google</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="correo_asistente@gmail.com"
                    value={newAdminInput}
                    onChange={(e) => setNewAdminInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Agregar Admin
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  El usuario podrá iniciar sesión inmediatamente usando el botón de Google.
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-400" />
                <span>Solo el Super Administrador ({SUPER_ADMIN_EMAIL}) tiene permisos para agregar o remover administradores.</span>
              </div>
            )}

            {/* Lista de Administradores Actuales */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-700">
                Cuentas de Administrador Activas:
              </h4>

              <div className="space-y-2">
                {authorizedAdmins.map((adminEmail) => {
                  const isMainSuperAdmin = adminEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                  return (
                    <div
                      key={adminEmail}
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        isMainSuperAdmin
                          ? "bg-amber-50/60 border-amber-200"
                          : "bg-white border-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            isMainSuperAdmin
                              ? "bg-amber-100 text-amber-700"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {isMainSuperAdmin ? <Crown className="w-4 h-4 text-amber-600" /> : <UserCheck className="w-4 h-4 text-zinc-600" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-black text-zinc-900">
                              {adminEmail}
                            </span>
                            {isMainSuperAdmin && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                                Inmutable • Propietario
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-500">
                            {isMainSuperAdmin ? "Super Administrador Principal" : "Administrador Delegado"}
                          </span>
                        </div>
                      </div>

                      {/* Botón Eliminar (Protegido contra superadmin) */}
                      {isSuperAdmin && !isMainSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAdmin(adminEmail)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Revocar</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
