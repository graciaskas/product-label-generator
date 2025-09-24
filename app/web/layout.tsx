import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import { SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import AuthProvider from "@/providers/AuthProvider";
import AppContextProvider, { AppContext } from "@/contexts/AppContextProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense, useContext } from "react";

import Loading from "@/components/Loading";
import AppMenuContentHeader from "@/components/AppMenuContentHeader";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppContextProvider>
        <SidebarProvider>
          <Suspense fallback={<Loading />}>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 ">
                <SidebarHeader className="border-b px-6 py-4 h-[81px]">
                  <AppMenuContentHeader />
                </SidebarHeader>
                <div className="p-6">{children}</div>
              </main>
            </div>
          </Suspense>
        </SidebarProvider>
      </AppContextProvider>
    </AuthProvider>
  );
}
