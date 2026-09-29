// Single source of truth for the catalog. Both the storefront and the payment
// session read prices from here, so the amount charged can never drift from
// the amount displayed. The ePayco session is created server-side, so this
// module must stay free of browser-only APIs.

export type Product = {
  id: string;
  name: string;
  priceUSD: number;
  priceCOP: number;
  image: string;
  weight: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Detox Manzana",
    priceUSD: 46,
    priceCOP: 95000,
    image: "/images/manzana.png",
    weight: "400 G",
    description:
      "Refresca, depura y revitaliza tu cuerpo, esta bebida combina el sabor dulce y suave de la manzana con ingredientes naturales que ayudan a eliminar las toxinas de manera natural, mejorar la digestión y desinflamar el organismo. Perfecto para acompañar tus rutinas saludables, sin azúcares añadidos ni conservantes.",
  },
  {
    id: "p2",
    name: "Colágeno Hidrolizado Vainilla",
    priceUSD: 46,
    priceCOP: 95000,
    image: "/images/vainilla.png",
    weight: "400 G",
    description:
      "Disfruta de una experiencia deliciosa mientras nutres tu piel, cabello, uñas y articulaciones. Su fórmula de fácil absorción está diseñada para que tu cuerpo obtenga todos los beneficios del colágeno de forma rápida y eficaz.",
  },
  {
    id: "p3",
    name: "Colágeno Hidrolizado Café",
    priceUSD: 46,
    priceCOP: 95000,
    image: "/images/cafe.png",
    weight: "400 G",
    description:
      "Disfruta lo mejor del café con todos los beneficios del colágeno hidrolizado en una mezcla única que nutre tu cuerpo mientras activa tu día. Ideal para quienes aman el café y cuidan su piel, articulaciones, cabello y bienestar desde adentro.",
  },
  {
    id: "p4",
    name: "Colágeno Hidrolizado Fresa",
    priceUSD: 46,
    priceCOP: 95000,
    image: "/images/fresa.png",
    weight: "400 G",
    description:
      "Revitaliza tu cuerpo con el delicioso sabor de la fresa. Este colágeno hidrolizado apoya la salud de tú piel, cabello y articulaciones, ofreciendo una opción refrescante y nutritiva para tu rutina de bienestar.",
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

// Colombia bills in COP; every other market bills in USD. This mirrors
// cartStore.setCountry, which the client uses to pick its display currency.
export type BillingCurrency = "COP" | "USD";

export function currencyForCountry(country: string): BillingCurrency {
  return country === "Colombia" ? "COP" : "USD";
}

export function priceForCurrency(
  product: Product,
  currency: BillingCurrency
): number {
  return currency === "COP" ? product.priceCOP : product.priceUSD;
}

export type CartLine = {
  id: string;
  qty: number;
};

/**
 * Recomputes the order total from catalog data. The browser sends only
 * product ids and quantities; every price comes from here. Returns null when
 * the cart is empty, references an unknown product, or asks for a non-positive
 * quantity, so an invalid cart can never reach ePayco.
 */
export function priceCart(
  lines: CartLine[],
  currency: BillingCurrency
): { amount: number; currency: BillingCurrency; items: number } | null {
  if (!Array.isArray(lines) || lines.length === 0) return null;

  let amount = 0;
  let items = 0;

  for (const line of lines) {
    const product = findProduct(line.id);
    if (!product) return null;

    const qty = Math.floor(line.qty);
    if (!Number.isFinite(qty) || qty < 1) return null;

    amount += priceForCurrency(product, currency) * qty;
    items += qty;
  }

  if (amount <= 0) return null;

  return { amount, currency, items };
}
