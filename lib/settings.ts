import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export interface SettingsConfig {
  ratePer24h: number;
  ratePerExtraHour: number;
  standardCapacity: number;
  checkInWindowStart: string; // "08:00"
  checkInWindowEnd: string;   // "18:00"
  promo7x6Enabled: boolean;
  blockedDates: string[];     // ["YYYY-MM-DD", ...]
  customCapacities: Record<string, number>; // { "YYYY-MM-DD": 45 }
  workingDays: number[];      // [0, 1, 2, 3, 4, 5, 6] (0 = Sunday, 1 = Monday, etc.)
}

export const DEFAULT_SETTINGS: SettingsConfig = {
  ratePer24h: 65000,
  ratePerExtraHour: 10000,
  standardCapacity: 20,
  checkInWindowStart: "08:00",
  checkInWindowEnd: "18:00",
  promo7x6Enabled: true,
  blockedDates: [],
  customCapacities: {},
  workingDays: [0, 1, 2, 3, 4, 5, 6], // Todos los días por defecto
};

const SETTINGS_DOC = "config/general";

/**
 * Obtener la configuración actual desde Firestore (con fallback seguro a DEFAULT_SETTINGS)
 */
export async function getSettings(): Promise<SettingsConfig> {
  try {
    const docRef = doc(db, "config", "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SettingsConfig;
    }
  } catch (error) {
    console.warn("No se pudo cargar la configuración de Firestore, usando defaults:", error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Guardar o actualizar la configuración en Firestore
 */
export async function saveSettings(newSettings: Partial<SettingsConfig>): Promise<void> {
  const docRef = doc(db, "config", "general");
  await setDoc(docRef, newSettings, { merge: true });
}

/**
 * Escuchar cambios en tiempo real de la configuración
 */
export function subscribeSettings(onUpdate: (settings: SettingsConfig) => void): () => void {
  try {
    const docRef = doc(db, "config", "general");
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SettingsConfig);
        } else {
          onUpdate(DEFAULT_SETTINGS);
        }
      },
      (error) => {
        console.warn("Error en suscripción de settings:", error);
        onUpdate(DEFAULT_SETTINGS);
      }
    );
  } catch {
    onUpdate(DEFAULT_SETTINGS);
    return () => {};
  }
}
