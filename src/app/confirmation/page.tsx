import type { Metadata } from "next";
import Link from "next/link";
import {
  readPaymentSummary,
  formatAmount,
  type EpaycoSearchParams,
} from "@/lib/epayco";

export const metadata: Metadata = {
  title: "Comprobante de pago",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<EpaycoSearchParams>;
};

const rows: Array<[keyof ReturnType<typeof readPaymentSummary>, string]> = [
  ["status", "Estado"],
  ["ref", "Referencia"],
  ["transactionId", "ID de transacción"],
  ["amount", "Monto"],
  ["currency", "Moneda"],
  ["date", "Fecha"],
];

export default async function ConfirmationPage({ searchParams }: Props) {
  const summary = readPaymentSummary(await searchParams);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Comprobante de pago
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          CG Productos · cglabs.fit
        </p>

        <dl className="divide-y divide-gray-100 border-y border-gray-100">
          {rows.map(([key, label]) => {
            const value = summary[key];
            const display =
              key === "amount"
                ? formatAmount(summary.amount, summary.currency)
                : (value ?? "-");

            return (
              <div
                key={key}
                className="flex items-baseline justify-between gap-6 py-3"
              >
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-right font-mono text-sm font-semibold text-gray-900">
                  {display}
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-8 text-sm leading-relaxed text-gray-500">
          Conserva esta referencia para cualquier consulta sobre tu pedido.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block bg-black text-white px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-800"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
