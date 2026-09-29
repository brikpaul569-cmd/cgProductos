import crypto from "crypto";

/**
 * Webhook de confirmación de ePayco.
 *
 * ePayco envía la transacción como parámetros de query en la URL de un POST
 * (x_ref_payco, x_transaction_id, x_amount, x_currency_code, x_signature, ...),
 * no como form-data.
 *
 * La firma es un hash SHA-256 simple (NO es HMAC) construido con las
 * credenciales del comercio publicadas en el panel de ePayco
 * (P_CUST_ID_CLIENTE y P_KEY), no con las llaves de API.
 */
function buildLocalSignature(data, pCustIdCliente, pKey) {
  return crypto
    .createHash("sha256")
    .update(
      [
        pCustIdCliente,
        pKey,
        data.x_ref_payco,
        data.x_transaction_id,
        data.x_amount,
        data.x_currency_code,
      ].join("^")
    )
    .digest("hex");
}

/**
 * ePayco entrega los datos como query params. Algunos entornos antiguos
 * envían form-urlencoded, así que se leen ambos y se combinan.
 */
async function readTransactionPayload(request) {
  const payload = {};

  for (const [key, value] of new URL(request.url).searchParams) {
    payload[key] = value;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      const form = await request.formData();
      for (const [key, value] of form.entries()) {
        if (payload[key] === undefined) {
          payload[key] = String(value);
        }
      }
    } catch {
      // Sin body legible: los query params ya recolectados bastan.
    }
  }

  return payload;
}

function isEqualSignature(received, computed) {
  if (typeof received !== "string" || received.length !== computed.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(received, "utf8"),
    Buffer.from(computed, "utf8")
  );
}

export async function POST(request) {
  const pCustIdCliente = process.env.EPAYCO_P_CUST_ID_CLIENTE;
  const pKey = process.env.EPAYCO_P_KEY;

  if (!pCustIdCliente || !pKey) {
    console.error(
      "❌ Faltan EPAYCO_P_CUST_ID_CLIENTE o EPAYCO_P_KEY en el servidor."
    );
    return new Response("Configuración de webhook incompleta", {
      status: 500,
    });
  }

  try {
    const data = await readTransactionPayload(request);
    const {
      x_ref_payco,
      x_transaction_id: xTransactionId,
      x_response,
      x_amount,
      x_currency_code,
    } = data;

    if (!x_ref_payco || !xTransactionId) {
      console.warn("⚠️ Webhook sin x_ref_payco o x_transaction_id, se ignora.");
      return new Response("Payload incompleto", { status: 400 });
    }

    const firmaLocal = buildLocalSignature(data, pCustIdCliente, pKey);

    if (!isEqualSignature(data.x_signature, firmaLocal)) {
      console.warn("⚠️ Firma inválida. Referencia:", x_ref_payco);
      return new Response("Firma no válida", { status: 403 });
    }

    // A partir de acá la transacción viene firmada por ePayco. Esta es la
    // única señal del lado del servidor que confirma un cobro: la redirección
    // del cliente no es confiable.
    const ACEPTADOS = new Set(["aceptada", "aprobada", "approved"]);
    const RECHAZADOS = ["rechaz", "declin", "fallid", "cancel", "error"];
    const estado = (x_response ?? "").toLowerCase().trim();

    if (ACEPTADOS.has(estado)) {
      console.log("💰 PAGO APROBADO", {
        ref: x_ref_payco,
        transaccion: xTransactionId,
        monto: x_amount,
        moneda: x_currency_code,
      });
    } else if (RECHAZADOS.some((m) => estado.includes(m))) {
      console.log("⚠️ PAGO RECHAZADO", {
        ref: x_ref_payco,
        transaccion: xTransactionId,
        estado: x_response,
        monto: x_amount,
        moneda: x_currency_code,
      });
    } else {
      console.log("⏳ PAGO PENDIENTE", {
        ref: x_ref_payco,
        transaccion: xTransactionId,
        estado: x_response,
        monto: x_amount,
        moneda: x_currency_code,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return new Response("Error interno", { status: 500 });
  }
}

export async function GET() {
  return new Response("Método no permitido", { status: 405 });
}
