"use client";

import { useCartStore } from "@/store/cartStore";

export default function Checkout() {
  const itemsCount = useCartStore((s) => s.getItemCount());
  const country = useCartStore((s) => s.country);
  const total = useCartStore((s) => s.getTotal());

  const handlePay = () => {
    if (itemsCount === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const { amount, currency } = total;

    if (typeof window.ePayco !== "undefined") {
      const handler = window.ePayco.checkout.configure({
        key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
        test: process.env.NEXT_PUBLIC_EPAYCO_TEST === "true",
      });

      const paymentData = {
        name: "Compra CG Productos",
        description: `Compra de ${itemsCount} tarro(s)`,
        invoice: `order_${Date.now()}`,
        currency: currency,
        amount: amount,
        country: country,
        tax_base: "0",
        tax: "0",
        method: "POST" as const, // ✅ ahora correcto para TS
        response: "https://tusitio.com/response",
        confirmation: "https://tusitio.com/confirmation",
        external: `order_${Date.now()}`,
      };

      handler.open(paymentData);
    } else {
      alert(
        `Redirigiendo a ePayco (mock)\nPaís: ${country}\nMonto: ${amount} ${currency}`
      );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePay}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
      >
        Pagar
      </button>
    </div>
  );
}
