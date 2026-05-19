// app/api/usuario/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { z } from "zod";

// Helper para verificar token y rol
async function verificarAdmin(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (payload.rol !== "ADMIN") return null;
    return payload;
  } catch {
    return null;
  }
}

// GET /api/usuario — solo ADMIN
export async function GET(req: NextRequest) {
  const admin = await verificarAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const usuario = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      intentosFallidos: true,
      bloqueadoHasta: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(usuario);
}

const crearUsuarioSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  rol: z.enum(["ADMIN", "TESORERO", "ENCARGADO", "FAMILIA"]),
});

// POST /api/usuarios — crear usuario (solo ADMIN)
export async function POST(req: NextRequest) {
  const admin = await verificarAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = crearUsuarioSchema.parse(body);

    const existe = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existe) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash,
        rol: data.rol,
      },
      select: { id: true, nombre: true, email: true, rol: true, createdAt: true },
    });

    // Bitácora
    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "CREAR_USUARIO",
        entidad: "Usuario",
        entidadId: usuario.id,
        detalles: { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        usuarioId: admin.id as string,
      },
    });

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", detalles: error.errors }, { status: 400 });
    }
    console.error("[CREAR USUARIO ERROR]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}