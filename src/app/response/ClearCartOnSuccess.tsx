// components: clears the cart once the customer lands back from ePayco
// with a settled payment. Kept separate so /response stays a server component.
"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ClearCartOnSuccess({ shouldClear }: { shouldClear: boolean }) {
  const clear = useCartStore((s) => s.clear);
  const cleared = useRef(false);

  useEffect(() => {
    if (!shouldClear || cleared.current) return;
    cleared.current = true;
    clear();
  }, [shouldClear, clear]);

  return null;
}
