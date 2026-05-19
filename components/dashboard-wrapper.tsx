"use client"
import { useRouter } from "next/navigation";
import { DashboardView } from "./dashboard-view";
import type { ViewType } from "@/app/page";

export function DashboardWrapper() {
  const router = useRouter();
  
  const handleNavigate = (view: ViewType) => {
    router.push(`/${view}`);
  };

  return <DashboardView onNavigate={handleNavigate} />;
}