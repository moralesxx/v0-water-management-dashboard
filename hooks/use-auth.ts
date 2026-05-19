// hooks/use-auth.ts
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface UsuarioSesion {
  id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "TESORERO" | "ENCARGADO" | "FAMILIA";
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return null;
      }
      router.push("/dashboard");
      router.refresh();
      return data.usuario as UsuarioSesion;
    } catch {
      setError("Error de conexión");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  return { login, logout, loading, error };
}