// Renders the outcome of returning from ePayco.
//
// The copy is deliberately split into three distinct cases instead of a
// generic "pending" message. Telling a customer their payment is "pending" when
// we have no information implies we may have taken their money. The honest
// wording is that we could not confirm it, and that we will follow up.
//
// Every value here comes from the URL and is therefore customer-controlled. It
// drives the wording only; it is never a basis for fulfilling an order.

import Link from "next/link";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import {
  readPaymentSummary,
  isPaymentAccepted,
  isPaymentRejected,
  formatAmount,
  type EpaycoSearchParams,
} from "@/lib/epayco";

type Props = {
  searchParams: Promise<EpaycoSearchParams>;
};

export default async function PaymentOutcomePage({ searchParams }: Props) {
  const summary = readPaymentSummary(await searchParams);

  const accepted = isPaymentAccepted(summary);
  const rejected = isPaymentRejected(summary);
  // No usable status: ePayco did not report one, or the customer closed the
  // tab before the redirect. We genuinely do not know the outcome.

  const Icon = accepted ? CheckCircle2 : rejected ? XCircle : HelpCircle;
  const tone = accepted
    ? "text-green-600"
    : rejected
      ? "text-red-600"
      : "text-amber-600";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-lg rounded-2xl bg-white p-10 text-center shadow-md">
        <Icon className={`mx-auto mb-6 h-16 w-16 ${tone}`} />

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {accepted
            ? "¡Gracias por tu compra!"
            : rejected
              ? "No se completó tu pago"
              : "No pudimos confirmar tu pago"}
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          {accepted
            ? "Recibimos la confirmación del pago. Te contactaremos por correo con los detalles y el número de seguimiento."
            : rejected
              ? "No se realizó ningún cargo a tu tarjeta o método de pago. Podés intentar nuevamente eligiendo otra forma de pago."
              : "Tu pago no pudo ser verificado en este momento. Si ya realizaste el cobro, no te preocupes: conservamos el registro de la transacción y nos pondremos en contacto contigo para confirmarla. Si no completaste el pago, no se realizó ningún cargo."}
        </p>

        {summary.ref && (
          <p className="mb-4 text-sm text-gray-500">
            Referencia:{" "}
            <span className="font-mono font-semibold text-gray-800">
              {summary.ref}
            </span>
          </p>
        )}

        {summary.amount && (
          <p className="mb-8 text-sm text-gray-500">
            Monto: {formatAmount(summary.amount, summary.currency)}
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            className="bg-black text-white px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-800"
          >
            Volver al inicio
          </Link>

          {!accepted && (
            <Link
              href="/"
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              {rejected ? "Intentar el pago de nuevo" : "Volver a la tienda"}
            </Link>
          )}
        </div>

        {!accepted && (
          <p className="mt-8 text-sm text-gray-400">
            Ante cualquier duda escribinos y verificamos tu pago con la
            referencia de la transacción.
          </p>
        )}

        <ClearCartOnSuccess shouldClear={accepted} />
      </div>
    </div>
  );
}
