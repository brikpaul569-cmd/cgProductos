import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "CG Productos",
  description: "Tienda minimalista con carrito de compras",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${montserrat.variable} light`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <Header /> {/* El Header se mantiene aquí para toda la aplicación */}
        <main>
          {" "}
          {/* Contenedor principal para el contenido de la página */}
          {children}
        </main>
        {/* Script de ePayco */}
        <Script
          src="https://checkout.epayco.co/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
