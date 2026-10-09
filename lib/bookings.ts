import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { SettingsConfig } from "./settings";

export interface Booking {
  id?: string;
  petName: string;
  petBreed: string;
  petAge: string;
  isNeutered: string;
  inHeat: string;
  isSociable: string;
  checkInDate: string;  // "YYYY-MM-DD"
  checkInTime: string;  // "HH:mm"
  checkOutDate: string; // "YYYY-MM-DD"
  checkOutTime: string; // "HH:mm"
  daysCount: number;
  extraHours: number;
  totalAmount: number;
  foodSchedule?: string;
  specialNotes?: string;
  ownerName: string;
  ownerPhone: string;
  ownerId?: string;
  instagramUser?: string;
  ownerAddress?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt?: any;
}

/**
 * Guardar una nueva reserva en Firestore
 */
export async function createBooking(
  bookingData: Omit<Booking, "id" | "createdAt" | "status"> & { status?: Booking["status"] }
): Promise<string> {
  const colRef = collection(db, "bookings");

  // Limpiar cualquier campo undefined para evitar errores de Firestore
  const cleanData: Record<string, any> = {};
  for (const [key, val] of Object.entries(bookingData)) {
    if (val !== undefined) {
      cleanData[key] = val;
    } else {
      cleanData[key] = "";
    }
  }

  const docRef = await addDoc(colRef, {
    ...cleanData,
    status: bookingData.status || "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Obtener todas las reservas de Firestore
 */
export async function getBookings(): Promise<Booking[]> {
  try {
    const colRef = collection(db, "bookings");
    const q = query(colRef, orderBy("checkInDate", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Booking[];
  } catch (err) {
    console.warn("No se pudieron obtener las reservas de Firestore:", err);
    return [];
  }
}

/**
 * Suscribirse a reservas en tiempo real
 */
export function subscribeBookings(onUpdate: (bookings: Booking[]) => void): () => void {
  try {
    const colRef = collection(db, "bookings");
    const q = query(colRef, orderBy("checkInDate", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Booking[];
        onUpdate(list);
      },
      (err) => {
        console.warn("Error en suscripción de bookings:", err);
        onUpdate([]);
      }
    );
  } catch {
    onUpdate([]);
    return () => {};
  }
}

/**
 * Actualizar el estado de una reserva
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: Booking["status"]
): Promise<void> {
  const docRef = doc(db, "bookings", bookingId);
  await updateDoc(docRef, { status: newStatus });
}

/**
 * Comprobar la disponibilidad y aforo para una fecha específica
 */
export function checkDateAvailability(
  dateStr: string,
  settings: SettingsConfig,
  bookings: Booking[]
): {
  available: boolean;
  capacity: number;
  occupied: number;
  remaining: number;
  reason?: string;
} {
  // 1. Revisar si la fecha está bloqueada explícitamente por Gabriel
  if (settings.blockedDates?.includes(dateStr)) {
    return {
      available: false,
      capacity: 0,
      occupied: 0,
      remaining: 0,
      reason: "Fecha no disponible o cerrada por administración.",
    };
  }

  // 2. Revisar si cae en un día de la semana no laborable
  if (settings.workingDays && settings.workingDays.length > 0) {
    // Parse date (asumiendo formato YYYY-MM-DD local)
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 = Domingo
    if (!settings.workingDays.includes(dayOfWeek)) {
      return {
        available: false,
        capacity: 0,
        occupied: 0,
        remaining: 0,
        reason: "La guardería no tiene atención para este día de la semana.",
      };
    }
  }

  // 3. Determinar capacidad del día (personalizada para temporada o estándar)
  const capacity =
    settings.customCapacities?.[dateStr] !== undefined
      ? settings.customCapacities[dateStr]
      : settings.standardCapacity;

  // 4. Contar cuántos perritos están activos en esa fecha (reservas confirmadas o pendientes)
  const activeBookings = bookings.filter((b) => {
    if (b.status === "cancelled") return false;
    if (!b.checkInDate || !b.checkOutDate) return false;
    return b.checkInDate <= dateStr && dateStr <= b.checkOutDate;
  });

  const occupied = activeBookings.length;
  const remaining = Math.max(0, capacity - occupied);

  return {
    available: remaining > 0,
    capacity,
    occupied,
    remaining,
    reason: remaining === 0 ? "Aforo completo para esta fecha." : undefined,
  };
}

/**
 * Generar enlace directo a Google Calendar sin necesidad de APIs pagas
 */
export function createGoogleCalendarUrl(params: {
  title: string;
  details: string;
  location?: string;
  startDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endDate: string;   // "YYYY-MM-DD"
  endTime: string;   // "HH:mm"
}): string {
  // Formato ISO compacto UTC o local YYYYMMDDTHHMMSS
  const startClean = `${params.startDate.replace(/-/g, "")}T${params.startTime.replace(/:/g, "")}00`;
  const endClean = `${params.endDate.replace(/-/g, "")}T${params.endTime.replace(/:/g, "")}00`;

  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const url = `${baseUrl}&text=${encodeURIComponent(params.title)}&dates=${startClean}/${endClean}&details=${encodeURIComponent(params.details)}&location=${encodeURIComponent(params.location || "La Guardería de Kira, Barranquilla")}`;
  return url;
}
