// Helpers to read the transaction fields ePayco appends to the
// response/confirmation redirects.

export type EpaycoSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type PaymentSummary = {
  ref: string | null;
  transactionId: string | null;
  status: string | null;
  amount: string | null;
  currency: string | null;
  date: string | null;
};

const first = (value: string | string[] | undefined): string | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
};

export function readPaymentSummary(
  params: EpaycoSearchParams
): PaymentSummary {
  return {
    ref: first(params.x_ref_payco ?? params.RefPayco ?? params.ref),
    transactionId: first(params.x_transaction_id ?? params.TransactionID),
    status: first(params.x_response ?? params.status),
    amount: first(params.x_amount ?? params.Amount),
    currency: first(params.x_currency_code ?? params.Currency),
    date: first(params.x_acceptance_date ?? params.x_response_date),
  };
}

// ePayco reports "Aceptada" for a settled payment. Everything else
// (Pendiente, Rechazada, ...) must not be presented as a confirmed purchase.
export function isPaymentAccepted(summary: PaymentSummary): boolean {
  return summary.status?.toLowerCase() === "aceptada";
}

export function formatAmount(
  amount: string | null,
  currency: string | null
): string {
  if (!amount) return "-";
  const value = Number(amount);
  if (!Number.isFinite(value)) return amount;
  return `${value.toLocaleString("es-CO")} ${currency ?? ""}`.trim();
}
