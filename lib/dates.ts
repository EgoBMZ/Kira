/**
 * Utilidades seguras para el manejo y cálculo de fechas y ciclos de 24 horas.
 * Previene números NaN, años malformados y desbordes numéricos.
 */

/**
 * Parsea de forma segura una cadena de fecha YYYY-MM-DD y hora HH:mm.
 * Maneja casos como años con dígitos extra (ej. "102026-10-09") o cadenas incompletas.
 */
export function parseSafeDate(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;

  const cleanDate = dateStr.trim();
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return null;

  const [rawYear, monthStr, dayStr] = parts;
  let yearStr = rawYear;
  // Si el año tiene más de 4 dígitos (ej. "102026" por autocompletado del navegador), tomamos los últimos 4
  if (yearStr.length > 4) {
    yearStr = yearStr.slice(-4);
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (year < 2024 || year > 2035 || month < 0 || month > 11 || day < 1 || day > 31) return null;

  const [hStr, mStr] = (timeStr || "09:00").split(":");
  const hours = parseInt(hStr || "9", 10);
  const minutes = parseInt(mStr || "0", 10);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  const dateObj = new Date(year, month, day, hours, minutes, 0, 0);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

/**
 * Limpia y normaliza una cadena de entrada de fecha a formato estándar YYYY-MM-DD.
 */
export function sanitizeDateStr(rawDate: string): string {
  if (!rawDate) return "";
  const parts = rawDate.trim().split("-");
  if (parts.length === 3) {
    const [rawY, m, d] = parts;
    let y = rawY;
    if (y.length > 4) {
      y = y.slice(-4);
    }
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return rawDate;
}

/**
 * Formatea una fecha para mostrarla de forma elegante en español (ej. "9 de Octubre, 2026")
 */
export function formatFriendlyDate(dateStr: string): string {
  const d = parseSafeDate(dateStr);
  if (!d) return dateStr;
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export interface CycleCalculation {
  days: number;
  extraHours: number;
  chargeableDays: number;
  freeDays: number;
  totalAmount: number;
  valid: boolean;
  error?: string | null;
}

/**
 * Calcula los ciclos oficiales de 24 horas y el valor en COP de manera 100% segura.
 * Garantiza que NUNCA retorne NaN ni valores indefinidos.
 */
export function calculateStayCycles(
  checkInDate: string,
  checkInTime: string,
  checkOutDate: string,
  checkOutTime: string,
  rate24h: number = 65000,
  rateExtra: number = 10000,
  promo7x6Enabled: boolean = true
): CycleCalculation {
  const defaultFallback: CycleCalculation = {
    days: 1,
    extraHours: 0,
    chargeableDays: 1,
    freeDays: 0,
    totalAmount: rate24h || 65000,
    valid: false,
    error: "Fechas no seleccionadas o inválidas.",
  };

  const start = parseSafeDate(checkInDate, checkInTime);
  const end = parseSafeDate(checkOutDate, checkOutTime);

  if (!start || !end) {
    return {
      ...defaultFallback,
      error: "Por favor ingresa fechas válidas en formato AAAA-MM-DD.",
    };
  }

  const diffMs = end.getTime() - start.getTime();

  if (isNaN(diffMs) || diffMs <= 0) {
    return {
      ...defaultFallback,
      error: "La fecha y hora de salida debe ser posterior a la de entrada.",
    };
  }

  const diffTotalHours = diffMs / (1000 * 60 * 60);
  if (isNaN(diffTotalHours) || diffTotalHours <= 0) {
    return defaultFallback;
  }

  let days = Math.floor(diffTotalHours / 24);
  let remainingHours = Math.ceil(diffTotalHours % 24);

  if (isNaN(days) || isNaN(remainingHours)) {
    return defaultFallback;
  }

  // Mínimo 1 ciclo de 24h
  if (days === 0 && remainingHours > 0) {
    days = 1;
    remainingHours = 0;
  } else {
    days = Math.max(1, days);
  }

  // Promo 7x6 (1 día gratis cada 7 días)
  const isPromo = promo7x6Enabled && days >= 7;
  const freeDays = isPromo ? Math.floor(days / 7) : 0;
  const chargeableDays = Math.max(1, days - freeDays);

  const daysTotal = chargeableDays * rate24h;
  // Tope de horas extra al valor de 1 día
  const extraHoursTotal = Math.min(remainingHours * rateExtra, rate24h);
  const totalAmount = daysTotal + extraHoursTotal;

  // Validación final blindada contra NaN
  const safeTotal = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : rate24h;
  const safeDays = Number.isFinite(days) && days > 0 ? days : 1;
  const safeExtra = Number.isFinite(remainingHours) && remainingHours >= 0 ? remainingHours : 0;

  return {
    days: safeDays,
    extraHours: safeExtra,
    chargeableDays,
    freeDays,
    totalAmount: safeTotal,
    valid: true,
    error: null,
  };
}
