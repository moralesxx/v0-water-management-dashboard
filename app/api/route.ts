// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Bloqueo por intentos fallidos
    if (
      usuario.bloqueadoHasta &&
      usuario.bloqueadoHasta > new Date()
    ) {
      return NextResponse.json(
        { error: "Cuenta bloqueada temporalmente. Intenta más tarde." },
        { status: 403 }
      );
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValida) {
      const intentos = usuario.intentosFallidos + 1;
      const bloquear = intentos >= 5;

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          intentosFallidos: intentos,
          bloqueadoHasta: bloquear
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
        },
      });

      return NextResponse.json(
        {
          error: bloquear
            ? "Cuenta bloqueada por 15 minutos por múltiples intentos fallidos"
            : `Credenciales inválidas. Intento ${intentos}/5`,
        },
        { status: 401 }
      );
    }

    // Reset intentos fallidos
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { intentosFallidos: 0, bloqueadoHasta: null },
    });

    // Registrar en bitácora
    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "LOGIN",
        entidad: "Usuario",
        entidadId: usuario.id,
        detalles: { email: usuario.email, rol: usuario.rol },
        usuarioId: usuario.id,
      },
    });

    // Crear JWT
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "8h")
      .setIssuedAt()
      .sign(secret);

    const response = NextResponse.json({
      ok: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}