import { priceCart, type BillingCurrency } from "@/lib/catalog";
import { RESPONSE_URL, SITE_URL } from "@/lib/site";
import { toEpaycoCountry } from "@/lib/epayco";

const APIFY_BASE = "https://apify.epayco.co";

// ePayco's Apify gateway authenticates with HTTP Basic using the public and
// private keys and returns a bearer token. The token is short lived, so it is
// fetched per session creation instead of being cached.
async function getApifyToken(publicKey: string, privateKey: string) {
  const basic = Buffer.from(`${publicKey}:${privateKey}`).toString("base64");

  const res = await fetch(`${APIFY_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basic}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Apify login failed with status ${res.status}`);
  }

  const body = (await res.json()) as { token?: string };
  if (!body.token) {
    throw new Error("Apify login response did not include a token");
  }

  return body.token;
}

type CreateSessionBody = {
  items?: { id?: unknown; qty?: unknown }[];
  currency?: unknown;
  country?: unknown;
  orderReference?: unknown;
};

export async function POST(request: Request) {
  const publicKey = process.env.EPAYCO_API_KEY;
  const privateKey = process.env.EPAYCO_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.error(
      "❌ Faltan EPAYCO_API_KEY o EPAYCO_PRIVATE_KEY en el servidor."
    );
    return Response.json(
      { error: "El servidor no tiene las credenciales de ePayco." },
      { status: 500 }
    );
  }

  let body: CreateSessionBody;
  try {
    body = (await request.json()) as CreateSessionBody;
  } catch {
    return Response.json({ error: "Cuerpo JSON inválido." }, { status: 400 });
  }

  // The browser only says what it wants to buy. Prices are resolved here.
  const lines = Array.isArray(body.items)
    ? body.items.map((item) => ({
        id: typeof item.id === "string" ? item.id : "",
        qty: typeof item.qty === "number" ? item.qty : Number.NaN,
      }))
    : [];

  const currency: BillingCurrency =
    body.currency === "USD" || body.currency === "COP" ? body.currency : "COP";

  const priced = priceCart(lines, currency);
  if (!priced) {
    return Response.json(
      { error: "El carrito no es válido o está vacío." },
      { status: 400 }
    );
  }

  const country =
    typeof body.country === "string" && body.country.trim() !== ""
      ? body.country
      : "Colombia";

  const orderReference =
    typeof body.orderReference === "string" && body.orderReference !== ""
      ? body.orderReference
      : `order_${Date.now()}`;

  try {
    const token = await getApifyToken(publicKey, privateKey);

    const res = await fetch(`${APIFY_BASE}/payment/session/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        checkout_version: "2",
        name: "Compra CG Productos",
        description: `Compra de ${priced.items} producto(s)`,
        currency: priced.currency,
        amount: priced.amount,
        tax_base: "0",
        tax: "0",
        country: toEpaycoCountry(country).toUpperCase(),
        lang: "ES",
        // Both URLs are defined server-side now: the panel configuration is
        // no longer what decides where the customer lands or where the
        // transaction is confirmed.
        response: RESPONSE_URL,
        confirmation: `${SITE_URL}/api/epayco-webhook`,
        invoice: orderReference,
        extra1: orderReference,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`❌ ePayco session/create respondió ${res.status}:`, detail);
      return Response.json(
        { error: "ePayco rechazó la creación de la sesión." },
        { status: 502 }
      );
    }

    const created = (await res.json()) as {
      success?: boolean;
      data?: { sessionId?: string };
      titleResponse?: string;
      textResponse?: string;
    };

    const sessionId = created.data?.sessionId;
    if (!sessionId) {
      console.error("❌ ePayco no devolvió sessionId:", created);
      return Response.json(
        { error: created.textResponse ?? "ePayco no devolvió una sesión." },
        { status: 502 }
      );
    }

    return Response.json({
      sessionId,
      test: process.env.NEXT_PUBLIC_EPAYCO_TEST === "true",
      amount: priced.amount,
      currency: priced.currency,
    });
  } catch (error) {
    console.error("❌ Error creando la sesión de ePayco:", error);
    return Response.json(
      { error: "No se pudo crear la sesión de pago." },
      { status: 502 }
    );
  }
}
