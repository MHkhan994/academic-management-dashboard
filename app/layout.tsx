import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/AppSidebar";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Academic Management Dashboard",
  description:
    "Comprehensive dashboard for managing students, courses, and faculty members with analytics and reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.variable} antialiased bg-sidebar w-full p-2 ps-0 pb-0`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SidebarProvider>
            <AppSidebar />
            <main className="bg-background border border-black/10 shadow-sm w-full rounded-xl min-h-screen">
              {/* <Navbar /> */}
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
