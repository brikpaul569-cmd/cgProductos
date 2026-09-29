"use client";

import { useCartStore } from "@/store/cartStore";
import { RESPONSE_URL, CONFIRMATION_URL } from "@/lib/site";

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

      // One order id for the whole payment: invoice and external must match
      // or the order cannot be traced back to the transaction.
      const orderReference = `order_${Date.now()}`;


    if (typeof window.ePayco !== "undefined") {
      const handler = window.ePayco.checkout.configure({
        key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
        test: process.env.NEXT_PUBLIC_EPAYCO_TEST === "true",
      });

      const paymentData = {
        name: "Compra CG Productos",
        description: `Compra de ${itemsCount} tarro(s)`,
        invoice: orderReference,
        currency: currency,
        amount: amount,
        country: country,
        tax_base: "0",
        tax: "0",
        method: "POST" as const, // ✅ ahora correcto para TS
        response: RESPONSE_URL,
        confirmation: CONFIRMATION_URL,
        external: orderReference,
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
