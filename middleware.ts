// middleware.ts (en la raíz del proyecto)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 🟢 SOLUCIÓN: Agregamos "/api/auth" completo para que todos los roles puedan consultar la sesión actual sin ser bloqueados
const PUBLIC_PATHS = ["/auth/login", "/api/auth", "/_next", "/favicon.ico", "/_vercel"];

// Rutas por rol base
const ROL_PATHS: Record<string, string[]> = {
  ADMIN: ["/dashboard", "/usuarios", "/familias", "/pagos", "/tanque", "/distribucion", "/incidencias", "/api"],
  TESORERO: ["/dashboard", "/pagos", "/familias", "/incidencias", "/api"], // 🟢 Agregamos "/api" para sus consultas de datos
  ENCARGADO: ["/dashboard", "/tanque", "/distribucion", "/incidencias", "/api"], // 🟢 Agregamos "/api" para sus consultas de datos
  FAMILIA: ["/dashboard", "/mi-cuenta", "/api"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Permitir recursos estáticos, analíticas y APIS de sesión de forma libre
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const rol = (payload.rol as string || "").toUpperCase();

    const rutasPermitidas = ROL_PATHS[rol] ?? [];
    const tieneAcceso = rutasPermitidas.some((r) => pathname.startsWith(r));

    if (!tieneAcceso) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();

    // Mantener la cookie viva en el navegador
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    response.headers.set("x-usuario-id", payload.id as string);
    response.headers.set("x-usuario-rol", rol);
    response.headers.set("x-usuario-nombre", payload.nombre as string);
    
    return response;
  } catch (error) {
    console.error("Middleware catch force login:", error);
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};