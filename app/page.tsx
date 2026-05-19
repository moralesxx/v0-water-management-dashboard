// app/page.tsx
import { redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/auth";

export default async function Home() {
  const usuario = await getUsuarioActual();

  if (!usuario) {
    redirect("/auth/login");
  }

  redirect("/dashboard");
}