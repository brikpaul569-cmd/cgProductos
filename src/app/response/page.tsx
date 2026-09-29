import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import {
  readPaymentSummary,
  isPaymentAccepted,
  formatAmount,
  type EpaycoSearchParams,
} from "@/lib/epayco";

export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<EpaycoSearchParams>;
};

export default async function PaymentResponsePage({ searchParams }: Props) {
  const summary = readPaymentSummary(await searchParams);
  const accepted = isPaymentAccepted(summary);

  const Icon = accepted ? CheckCircle2 : summary.status ? XCircle : Clock;
  const tone = accepted
    ? "text-green-600"
    : summary.status
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-md">
        <Icon className={`mx-auto mb-6 h-16 w-16 ${tone}`} />

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {accepted
            ? "¡Gracias por tu compra!"
            : summary.status
              ? "Tu pago no pudo completarse"
              : "Recibimos tu solicitud de pago"}
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          {accepted
            ? "Tu pago fue confirmado. Te contactaremos por correo con los detalles del envío."
            : summary.status
              ? "No se realizó ningún cargo. Podés intentar nuevamente con otro medio de pago."
              : "Tu pago está pendiente de confirmación. Si completaste el pago, recibirás un correo con el comprobante."}
        </p>

        {summary.ref && (
          <p className="mb-8 text-sm text-gray-500">
            Referencia:{" "}
            <span className="font-mono font-semibold text-gray-800">
              {summary.ref}
            </span>
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
              Reintentar el pago
            </Link>
          )}
        </div>

        {summary.amount && (
          <p className="mt-8 text-sm text-gray-500">
            Monto: {formatAmount(summary.amount, summary.currency)}
          </p>
        )}
      </div>

      <ClearCartOnSuccess shouldClear={accepted} />
    </div>
  );
}
