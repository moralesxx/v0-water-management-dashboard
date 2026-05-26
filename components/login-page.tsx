// components/login-page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
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
    // Contenedor principal sin bordes raros que ocupa toda la pantalla
    <div className="min-h-screen w-screen flex bg-background font-sans antialiased">
      
      {/* 🟢 LADO IZQUIERDO: Panel institucional premium (Se oculta en celulares automágicamente con 'hidden md:flex') */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-700 via-cyan-600 to-[#0A1728] items-center justify-center p-12 relative overflow-hidden">
        {/* Efecto de fondo abstracto de agua */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        
        <div className="max-w-md text-center text-white space-y-6 z-10">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg">
            {/* Cargamos tu escudo oficial */}
            <EscudoLogin />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-cyan-100">Portal de Servicios Digitales</h3>
            <p className="text-sm text-cyan-200/80 leading-relaxed">
              Simplificando el control administrativo, la recaudación y el monitoreo de la red de distribución de agua potable.
            </p>
          </div>
        </div>
      </div>

      {/* 🟢 LADO DERECHO: Formulario de inicio de sesión limpio y espaciado */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Cabecera para móviles (solo visible si no está en desktop) */}
          <div className="md:hidden text-center">
            <EscudoLogin />
            <div className="border-b border-border/60 my-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ingresar al Sistema</h2>
            <p className="text-sm text-muted-foreground">Coloque sus credenciales autorizadas para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
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
                suppressHydrationWarning={true}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all ${
                  errors.email ? "border-destructive ring-1 ring-destructive/40" : "border-border"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700">
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
                  suppressHydrationWarning={true}
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all ${
                    errors.password ? "border-destructive ring-1 ring-destructive/40" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                <p className="text-xs text-destructive mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Error del servidor */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-3.5 py-2.5">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs mt-2"
            >
              {loading ? "Verificando cuenta..." : "Acceder al portal"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            ¿Problemas para ingresar? Contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
}