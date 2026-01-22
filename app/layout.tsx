"use client";

import "./globals.css";
import { Toaster } from "sonner";
import Header from "./components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ThemeProvider } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./context/auth";
import { useEffect } from "react";

const publicRoutes = ["/login", "/forgot-password"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <title>APS - Admin</title>
      <body>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, loading } = useAuth();

  useEffect(() => {
    if (!loading && !auth?.token && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }
  }, [loading, auth?.token, pathname, router]);

  if (loading || (!auth?.token && !publicRoutes.includes(pathname))) return null;

  const hideLayout = publicRoutes.includes(pathname);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster theme="dark" position="top-center" offset={35} />

      {hideLayout ? (
        <main className="min-h-screen">{children}</main>
      ) : (
        <>
          <Header />
          <div className="flex pt-[90px] min-h-[calc(100vh-90px)]">
            <SidebarProvider>
              <AppSidebar />
              <div className="flex-1 overflow-y-auto p-4">
                <SidebarTrigger className="md:hidden fixed bg-white dark:bg-gray-800 border p-5 rounded-md z-50" />
                <main className="mt-6">{children}</main>
              </div>
            </SidebarProvider>
          </div>
        </>
      )}
    </ThemeProvider>
  );
}