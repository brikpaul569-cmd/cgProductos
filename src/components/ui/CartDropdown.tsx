// components/ui/CartDropdown.tsx
"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function CartDropdown() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const itemsCount = useCartStore((s) => s.getItemCount());
  const getTotal = useCartStore((s) => s.getTotal);

  const total = getTotal();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Icono carrito */}
      <button
        className="relative flex items-center"
        onClick={() => setOpen(!open)}
      >
        <ShoppingBag className="h-6 w-6" />
        {itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemsCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-50">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.qty} x{" "}
                      {total.currency === "COP"
                        ? item.priceCOP.toLocaleString()
                        : item.priceUSD.toLocaleString()}{" "}
                      {total.currency}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span>
                  {total.amount.toLocaleString()} {total.currency}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
