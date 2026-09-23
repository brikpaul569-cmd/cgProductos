"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartDropdown from "@/components/ui/CartDropdown";
import { useCartStore, COUNTRIES } from "@/store/cartStore";

// Checkout order id. Kept outside the component because it is business logic
// for the payment flow, not render-time state — it must be generated at the
// moment the user clicks Pay, never during render.
function createOrderId(): string {
  return `order_${Date.now()}`;
}

export default function Header() {
  const itemsCount = useCartStore((s) => s.getItemCount());
  const country = useCartStore((s) => s.country);
  const setCountry = useCartStore((s) => s.setCountry);
  const getTotal = useCartStore((s) => s.getTotal);

  const total = getTotal();

  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handlePay = () => {
    if (itemsCount === 0) {
      setAlertMsg("Tu carrito está vacío.");
      return;
    }

    const { amount, currency: curr } = total;

    if (typeof window.ePayco !== "undefined") {
      const handler = window.ePayco.checkout.configure({
        key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY ?? "",
        test: process.env.NEXT_PUBLIC_EPAYCO_TEST === "true",
        lang: "es",
        external: "false",
      });

      const checkoutData = {
        name: "Compra CG Productos",
        description: `Compra de ${itemsCount} tarro(s)`,
        invoice: createOrderId(),
        currency: curr,
        amount: amount,
        tax_base: "0",
        tax: "0",
        country: country,
        response: `${process.env.NEXT_PUBLIC_URL}/epayco/response`,
        confirmation: `${process.env.NEXT_PUBLIC_URL}/api/epayco/confirmation`,
        method: "POST" as const,
      };

      handler.open(checkoutData);
      return;
    }

    setAlertMsg(
      `Redirigiendo a ePayco (mock)\nPaís: ${country}\nMonto: ${amount} ${curr}`
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {alertMsg && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] bg-red-600/90 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-500 animate-fade">
          {alertMsg}
        </div>
      )}

      <header className="sticky top-0 z-[999] w-full bg-white/80 backdrop-blur-md">
        {/* Promo bar */}
        <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white text-center text-sm md:text-base py-1 font-semibold animate-pulse">
          VIVE LA EXPERIENCIA CON UN 25% DE DESCUENTO – EMPIEZA A CUIDARTE DESDE HOY –
        </div>

        {/* ✅ Main header con Flexbox */}
        <div className="flex justify-between items-center px-6 md:px-12 py-2 md:py-3 relative z-[1000]">
          {/* Logo y nombre de la marca (siempre visible) */}
          <div className="flex flex-col items-center md:items-start flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/Logo.png"
                alt="Logo CG Productos"
                width={100}
                height={100}
                className="object-contain filter invert-[0] brightness-[0] contrast-[100]"
              />
            </Link>
            <span className="text-xs md:text-sm font-light mt-1">
              CGProductos
            </span>
          </div>

          {/* Menú de navegación para desktop (oculto en móviles) */}
          <nav className="hidden md:flex flex-grow justify-center space-x-8 text-sm md:text-base font-semibold">
            <a
              href="#inicio"
              className="hover:text-green-600 transition-colors duration-300"
            >
              Inicio
            </a>
            <a
              href="#productos"
              className="hover:text-green-600 transition-colors duration-300"
            >
              Productos
            </a>
            <a
              href="#casos-exito"
              className="hover:text-green-600 transition-colors duration-300"
            >
              Casos de Éxito
            </a>
            <a
              href="#acerca"
              className="hover:text-green-600 transition-colors duration-300"
            >
              Acerca de Nosotros
            </a>
          </nav>

          {/* Controles de carrito y país (ocultos en móviles, visible en desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <select
              className="border rounded px-2 md:px-3 py-1 md:py-2 text-sm md:text-sm transition-shadow hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={country}
                onChange={(e) =>
                  setCountry(e.target.value as (typeof COUNTRIES)[number])
                }
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <CartDropdown />
            <div className="flex items-center space-x-2">
              <span className="text-sm md:text-sm font-semibold">
                {total.amount.toLocaleString()} {total.currency}
              </span>
              <button
                onClick={handlePay}
                className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-1 md:py-2 rounded-md text-sm md:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                Pagar
              </button>
            </div>
          </div>

          {/* Controles y botón de hamburguesa para móviles (oculto en desktop) */}
          <div className="md:hidden flex items-center space-x-2">
            <CartDropdown />
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil (visible solo si isMenuOpen es true) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md absolute top-full left-0 w-full shadow-lg p-6 animate-fade">
            <nav className="flex flex-col items-start space-y-4 text-base font-semibold">
              <a
                href="#inicio"
                className="hover:text-green-600 transition-colors duration-300 w-full"
                onClick={toggleMenu}
              >
                Inicio
              </a>
              <a
                href="#productos"
                className="hover:text-green-600 transition-colors duration-300 w-full"
                onClick={toggleMenu}
              >
                Productos
              </a>
              <a
                href="#casos-exito"
                className="hover:text-green-600 transition-colors duration-300 w-full"
                onClick={toggleMenu}
              >
                Casos de Éxito
              </a>
              <a
                href="#acerca"
                className="hover:text-green-600 transition-colors duration-300 w-full"
                onClick={toggleMenu}
              >
                Acerca de Nosotros
              </a>
            </nav>
            <div className="flex flex-col items-start space-y-4 mt-6">
              <select
                className="border rounded px-3 py-2 text-sm w-full"
                value={country}
              onChange={(e) =>
                setCountry(e.target.value as (typeof COUNTRIES)[number])
              }
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between w-full mt-4">
                <span className="text-base font-semibold">
                  {total.amount.toLocaleString()} {total.currency}
                </span>
                <button
                  onClick={handlePay}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}