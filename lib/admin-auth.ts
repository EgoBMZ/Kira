import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, SUPER_ADMIN_EMAIL } from "./firebase";

export interface AdminsData {
  superAdmin: string;
  admins: string[]; // Lista de correos autorizados adicionales
}

/**
 * Obtener la lista completa de correos administradores autorizados
 */
export async function getAuthorizedAdmins(): Promise<string[]> {
  try {
    const docRef = doc(db, "config", "admins");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as AdminsData;
      const list = data.admins || [];
      if (!list.includes(SUPER_ADMIN_EMAIL.toLowerCase())) {
        list.push(SUPER_ADMIN_EMAIL.toLowerCase());
      }
      return list;
    }
  } catch (err) {
    console.warn("No se pudo leer la lista de admins de Firestore:", err);
  }
  return [SUPER_ADMIN_EMAIL.toLowerCase()];
}

/**
 * Suscribirse en tiempo real a la lista de administradores
 */
export function subscribeAuthorizedAdmins(onUpdate: (admins: string[]) => void): () => void {
  try {
    const docRef = doc(db, "config", "admins");
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AdminsData;
          const list = (data.admins || []).map((e) => e.toLowerCase());
          if (!list.includes(SUPER_ADMIN_EMAIL.toLowerCase())) {
            list.push(SUPER_ADMIN_EMAIL.toLowerCase());
          }
          onUpdate(list);
        } else {
          onUpdate([SUPER_ADMIN_EMAIL.toLowerCase()]);
        }
      },
      (err) => {
        console.warn("Error en suscripción de admins:", err);
        onUpdate([SUPER_ADMIN_EMAIL.toLowerCase()]);
      }
    );
  } catch {
    onUpdate([SUPER_ADMIN_EMAIL.toLowerCase()]);
    return () => {};
  }
}

/**
 * Agregar un nuevo correo de administrador (solo si es diferente del superadmin)
 */
export async function addAdminEmail(newEmail: string): Promise<void> {
  const cleanEmail = newEmail.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Correo inválido.");
  }

  const currentAdmins = await getAuthorizedAdmins();
  if (currentAdmins.includes(cleanEmail)) {
    return; // Ya existe
  }

  const updated = [...currentAdmins, cleanEmail];
  const docRef = doc(db, "config", "admins");
  await setDoc(docRef, {
    superAdmin: SUPER_ADMIN_EMAIL.toLowerCase(),
    admins: updated,
  }, { merge: true });
}

/**
 * Eliminar un administrador adicional.
 * REGLA INMUTABLE: El Super Admin (egobmz@gmail.com) JAMÁS podrá ser eliminado.
 */
export async function removeAdminEmail(emailToRemove: string): Promise<void> {
  const cleanEmail = emailToRemove.trim().toLowerCase();
  if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error("El Super Administrador principal (egobmz@gmail.com) no puede ser eliminado.");
  }

  const currentAdmins = await getAuthorizedAdmins();
  const updated = currentAdmins.filter((e) => e.toLowerCase() !== cleanEmail);
  
  const docRef = doc(db, "config", "admins");
  await setDoc(docRef, {
    superAdmin: SUPER_ADMIN_EMAIL.toLowerCase(),
    admins: updated,
  }, { merge: true });
}

/**
 * Validar si un correo es administrador
 */
export function isEmailAdmin(email: string | null | undefined, authorizedList: string[]): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (clean === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
  return authorizedList.map((e) => e.toLowerCase()).includes(clean);
}
