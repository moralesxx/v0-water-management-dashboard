// app/api/usuarios/[id]/route.ts
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

const editarSchema = z.object({
  nombre: z.string().min(2).optional(),
  email: z.string().email().optional(),
  rol: z.enum(["ADMIN", "TESORERO", "ENCARGADO", "FAMILIA"]).optional(),
  activo: z.boolean().optional(),
  password: z.string().min(8).optional(), // Para cambio de contraseña
});

// ─── PATCH /api/usuarios/[id] ─────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verificarAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const data = editarSchema.parse(body);

    // Si viene password, hashearla y guardar como passwordHash
    const updateData: Record<string, any> = { ...data }
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12)
      delete updateData.password
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: { id: true, nombre: true, email: true, rol: true, activo: true, createdAt: true },
    });

    await prisma.bitacoraAuditoria.create({
      data: {
        accion: data.password ? "CAMBIAR_CONTRASENA" : "EDITAR_USUARIO",
        entidad: "Usuario",
        entidadId: usuario.id,
        detalles: data.password ? { accion: "Contraseña actualizada" } as any : data as any,
        usuarioId: admin.id as string,
      },
    });

    return NextResponse.json({ data: usuario });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("[PATCH /api/usuarios/:id]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ─── DELETE /api/usuarios/[id] ────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verificarAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "ELIMINAR_USUARIO",
        entidad: "Usuario",
        entidadId: id,
        detalles: { nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } as any,
        usuarioId: admin.id as string,
      },
    });

    await prisma.bitacoraAuditoria.deleteMany({ where: { usuarioId: id } });
    await prisma.familia.deleteMany({ where: { usuarioId: id } });
    await prisma.usuario.delete({ where: { id } });

    return NextResponse.json({ ok: true, mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("[DELETE /api/usuarios/:id]", error);
    return NextResponse.json({ error: "Error al eliminar el usuario" }, { status: 500 });
  }
}