import type { Metadata } from "next";
import { Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";
import ToastContainer from "@/components/ui/Toast";
import CartModal from "@/components/ui/CartModal";
import AuthModal from "@/components/ui/AuthModal";
import StickyNav from "@/components/ui/StickyNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["500", "600", "700", "900"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NOXA — Lens Q86 Wireless Earbuds",
  description: "Camera-styled TWS earbuds with a live digital charge display, clip-on secure fit, and IPX-5 waterproofing. Bluetooth 5.3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
          <AuthProvider>
            <UIProvider>
              <StickyNav />
              {children}
              <ToastContainer />
              <CartModal />
              <AuthModal />
            </UIProvider>
          </AuthProvider>
        </body>
    </html>
  );
}
