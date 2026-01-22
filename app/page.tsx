"use client";

import { useAuth } from "./context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppDashboard from "./dashboard/page";

export default function Home() {
  const { auth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !auth?.token) {
      router.replace("/login");
    }
  }, [loading, auth?.token, router]);

  if (loading) return <div>Loading...</div>;
  if (!auth?.token) return null; 

  return <AppDashboard />;
}
