// app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <-- CAMBIO: Tipado como promesa
) {
  const admin = await verificarAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // CORRECCIÓN 1: Desempaquetar params asíncronamente para evitar que id sea undefined
    const { id } = await params;

    const body = await req.json();
    const data = editarSchema.parse(body);

    const usuario = await prisma.usuario.update({
      where: { id: id }, // <-- CAMBIO: Usamos el id desempaquetado
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
    });

    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "EDITAR_USUARIO",
        entidad: "Usuario",
        entidadId: usuario.id,
        detalles: data as any,
        usuarioId: admin.id as string,
      },
    });

    // CORRECCIÓN 2: Envolver la respuesta en { data: usuario } para que sea compatible con tu frontend
    return NextResponse.json({ data: usuario });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("[EDITAR USUARIO]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}