// app/api/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { z } from "zod";

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

// GET /api/usuarios — solo ADMIN
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
  // Campos opcionales para rol FAMILIA
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  sectorId: z.string().optional(),
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

    // Validar campos extra si es FAMILIA
    if (data.rol === "FAMILIA") {
      if (!data.direccion) {
        return NextResponse.json({ error: "La dirección es requerida para familias" }, { status: 400 });
      }
      if (!data.sectorId) {
        return NextResponse.json({ error: "El sector es requerido para familias" }, { status: 400 });
      }
    }

    const existe = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (existe) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    // Si es FAMILIA, crear usuario + familia en una transacción
    if (data.rol === "FAMILIA") {
      const sector = await prisma.sector.findUnique({ where: { id: data.sectorId } });
      if (!sector) {
        return NextResponse.json({ error: "Sector no encontrado" }, { status: 404 });
      }

      // Generar código correlativo
      const ultimaFamilia = await prisma.familia.findFirst({
        orderBy: { createdAt: "desc" },
        select: { codigoFamilia: true },
      });
      const siguiente = ultimaFamilia
        ? parseInt(ultimaFamilia.codigoFamilia.replace("FAM-", ""), 10) + 1
        : 1;
      const codigoFamilia = `FAM-${String(siguiente).padStart(3, "0")}`;

      const resultado = await prisma.$transaction(async (tx) => {
        const nuevoUsuario = await tx.usuario.create({
          data: { nombre: data.nombre, email: data.email, passwordHash, rol: "FAMILIA" },
          select: { id: true, nombre: true, email: true, rol: true, createdAt: true },
        });

        await tx.familia.create({
          data: {
            codigoFamilia,
            nombreRepresentante: data.nombre,
            direccion: data.direccion!,
            telefono: data.telefono,
            estadoServicio: "ACTIVO",
            usuarioId: nuevoUsuario.id,
            sectorId: data.sectorId!,
          },
        });

        await tx.bitacoraAuditoria.create({
          data: {
            accion: "CREAR_USUARIO_FAMILIA",
            entidad: "Usuario",
            entidadId: nuevoUsuario.id,
            detalles: { nombre: data.nombre, email: data.email, codigoFamilia } as any,
            usuarioId: admin.id as string,
          },
        });

        return nuevoUsuario;
      });

      return NextResponse.json(resultado, { status: 201 });
    }

    // Para otros roles, solo crear el usuario
    const usuario = await prisma.usuario.create({
      data: { nombre: data.nombre, email: data.email, passwordHash, rol: data.rol },
      select: { id: true, nombre: true, email: true, rol: true, createdAt: true },
    });

    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "CREAR_USUARIO",
        entidad: "Usuario",
        entidadId: usuario.id,
        detalles: { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } as any,
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