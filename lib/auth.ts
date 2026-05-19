// lib/auth.ts
// Usar en Server Components y layouts para obtener el usuario de la sesión

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Rol } from "@prisma/client";

export interface SesionUsuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export async function getUsuarioActual(): Promise<SesionUsuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      nombre: payload.nombre as string,
      rol: payload.rol as Rol,
    };
  } catch {
    return null;
  }
}

// Uso en layout protegido:
//
// import { getUsuarioActual } from "@/lib/auth";
// import { redirect } from "next/navigation";
//
// export default async function DashboardLayout({ children }) {
//   const usuario = await getUsuarioActual();
//   if (!usuario) redirect("/login");
//   return <>{children}</>;
// }