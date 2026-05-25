// components/login-page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
// 🟢 Corregimos la ruta apuntando al archivo exacto en minúsculas y singular
import { EscudoLogin } from "@/components/logos-sistemas";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    await login(form.email, form.password);
  }

  return (
    // 🟢 1. Forzamos el fondo de pantalla exacto a #0A1728
    <div className="min-h-screen flex items-center justify-center bg-[#0A1728] p-4 font-sans antialiased">
      <div className="w-full max-w-sm">
        
        {/* 🟢 2. REEMPLAZO LOGRADO: Quitamos el logo gris viejo y los títulos de relleno para poner tu Escudo Oficial */}
        <div className="mb-8">
          <EscudoLogin />
        </div>

        {/* 🟢 3. Forzamos la tarjeta a usar tu color #112237 con un borde sutil y sombra estética */}
        <div className="bg-[#112237] border border-slate-800 rounded-2xl p-6 shadow-[0_0_50px_-12px_rgba(34,211,238,0.15)] text-slate-100">
          <h2 className="text-lg font-medium text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@ejemplo.com"
                // 🟢 Pasamos las cajas de texto a un tono oscuro integrado con el login
                className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-[#0A1728] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors ${
                  errors.email ? "border-destructive" : "border-slate-700"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm bg-[#0A1728] text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors ${
                    errors.password ? "border-destructive" : "border-slate-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error del servidor */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit — Estilizado en Cian brillante */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-[#0A1728] py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-500/10 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-[#0A1728]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Verificando...
                </span>
              ) : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          ¿Problemas para ingresar? Contacta al administrador.
        </p>
      </div>
    </div>
  );
}