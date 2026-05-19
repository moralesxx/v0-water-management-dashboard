// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // 🟢 Usamos la variable exacta de tu archivo .env
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dercas-super-secreto-jwt-2026-guatemalaXYZ!")
    const { payload } = await jwtVerify(token, secret)

    return NextResponse.json({
      ok: true,
      usuario: {
        id: payload.id as string,
        nombre: payload.nombre as string,
        username: payload.nombre as string,
        email: payload.email as string,
        rol: payload.rol as string,
        role: payload.rol as string, 
      }
    })

  } catch (error) {
    console.error("[API_ME_ERROR]", error)
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
  }
}