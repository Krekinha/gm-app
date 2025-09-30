import { IgniterProvider } from "@igniter-js/core/client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GM-App - Sistema de Gestão",
  description: "Sistema de gestão empresarial com sidebar flutuante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <IgniterProvider
          // enableRealtime={false} Descomente esta linha para desabilitar a conexão realtime
          debug={process.env.NODE_ENV === "development"}
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppTopbar />
              <main className="flex-1 overflow-auto p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </IgniterProvider>
      </body>
    </html>
  );
}
