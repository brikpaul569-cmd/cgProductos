import crypto from "crypto";

export async function POST(request) {
  try {
    const form = await request.formData();
    const data = Object.fromEntries(form.entries());

    console.log("🔔 Webhook recibido:", data);

    const apiKey = process.env.EPAYCO_API_KEY;
    const privateKey = process.env.EPAYCO_PRIVATE_KEY;

    // Generar firma local (usa los campos reales del webhook)
    const firmaLocal = crypto
      .createHash("sha256")
      .update(
        `${apiKey}^${privateKey}^${data.x_ref_payco}^${data.x_transaction_id}^${data.x_amount}^${data.x_currency_code}`
      )
      .digest("hex");

    if (firmaLocal !== data.x_signature) {
      console.log("⚠️ Firma inválida");
      return new Response("Firma no válida", { status: 403 });
    }

    if (data.x_response === "Aceptada") {
      console.log("💰 Pago aprobado:", data.x_amount);
    } else {
      console.log("⚠️ Pago no aprobado:", data.x_response);
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
