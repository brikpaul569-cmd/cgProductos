import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CG Productos",
    template: "%s | CG Productos",
  },
  description: "Tienda minimalista con carrito de compras",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "CG Productos",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
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
