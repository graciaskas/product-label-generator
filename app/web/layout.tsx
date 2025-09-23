import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import AuthProvider from "@/providers/AuthProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense } from "react";
import { Package, User2Icon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 ">
              <SidebarHeader className="border-b px-6 py-4 h-[81px]">
                <div className="flex justify-end gap-2 items-center w-full">
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                  <div
                    style={{ backgroundColor: "oklch(40.40% 0.042 160.33)" }}
                    className="w-8 h-8  rounded-lg flex items-center justify-center"
                  >
                    <User2Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Gracias Kasongo</h2>
                  </div>
                </div>
              </SidebarHeader>
              <div className="p-6">{children}</div>
            </main>
          </div>
        </Suspense>
      </SidebarProvider>
      <Analytics />
    </AuthProvider>
  );
}
