import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"
import "../globals.css"

export const metadata: Metadata = {
  title: "Pharmakina eLabelling",
  description: "Accédez au générateur d'étiquettes pharmaceutiques",
  authors: [{name:"Gracias Kasongo"}],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SidebarProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="p-6 flex flex-col justify-center items-center w-full h-full">
             
              <main className="">{children}</main>
            </div>
          </Suspense>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
