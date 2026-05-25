// app/page.tsx
import { redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/auth";
import LoginPage from "@/components/login-page";

export default async function Page() {
  const usuario = await getUsuarioActual();

  // 1. Si no hay una sesión activa, cargamos el formulario de login de forma nativa
  if (!usuario) {
    return <LoginPage />;
  }

  // 2. Si ya está logueado, lo mandamos directo al dashboard administrativo o familiar
  redirect("/dashboard");
}