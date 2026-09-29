// Helpers to read the transaction fields ePayco appends to the
// response/confirmation redirects.
//
// IMPORTANT TRUST BOUNDARY
// -----------------------
// These values arrive in the URL, so they are controlled by whoever typed the
// URL. They are trustworthy enough to render an informational message and
// nothing more. A customer can hand-edit `?x_response=Aceptada` and make this
// page claim a payment that never happened.
//
// The only server-side signal that a charge actually settled is the ePayco
// webhook. Until that is persisted, this page must never state a payment was
// confirmed as fact. Every message here is written to be honest about what is
// actually known.

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

// ePayco session identifiers are 24-char lowercase hex strings. They are an
// internal handle for the checkout widget and are meaningless to a customer,
// to support, and to ePayco's own reconciliation. Showing one as a payment
// reference is worse than showing nothing, because it looks like a receipt
// number the customer could quote and then find nowhere.
const SESSION_ID_PATTERN = /^[0-9a-f]{24}$/i;

export function isSessionId(value: string | null): boolean {
  return value !== null && SESSION_ID_PATTERN.test(value);
}

export function readPaymentSummary(
  params: EpaycoSearchParams
): PaymentSummary {
  const ref = first(
    params.ref_payco ??
      params.x_ref_payco ??
      params.RefPayco ??
      params.ref
  );

  return {
    // Smart Checkout (v2) and the classic API disagree on field names, so both
    // are read. Unknown values resolve to null rather than to a guess.
    ref: isSessionId(ref) ? null : ref,
    transactionId: first(
      params.transaction_id ??
        params.x_transaction_id ??
        params.TransactionID
    ),
    status: first(
      params.x_response ??
        params.status ??
        params.state ??
        params.estado
    ),
    amount: first(params.amount ?? params.x_amount ?? params.Amount),
    currency: first(
      params.currency_code ?? params.x_currency_code ?? params.Currency
    ),
    date: first(params.date ?? params.x_acceptance_date ?? params.x_response_date),
  };
}

// ePayco reports "Aceptada" for a settled payment. Everything else
// (Pendiente, Rechazada, ...) must not be presented as a confirmed purchase.
export function isPaymentAccepted(summary: PaymentSummary): boolean {
  const status = summary.status?.toLowerCase().trim();
  return status === "aceptada" || status === "aprobada" || status === "approved";
}

export function isPaymentRejected(summary: PaymentSummary): boolean {
  const status = summary.status?.toLowerCase().trim() ?? "";
  return (
    status.includes("rechaz") ||
    status.includes("rechazada") ||
    status.includes("declin") ||
    status.includes("fallid") ||
    status.includes("error") ||
    status.includes("cancel")
  );
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

// ePayco expects the ISO 3166-1 alpha-2 code, but the cart store keeps the
// display name because that is what the country selector renders.
const COUNTRY_CODES: Record<string, string> = {
  "United States": "us",
  "Panamá": "pa",
  "Costa Rica": "cr",
  "El Salvador": "sv",
  "Guatemala": "gt",
  "República Dominicana": "do",
  "Colombia": "co",
};

export function toEpaycoCountry(country: string): string {
  return COUNTRY_CODES[country] ?? "co";
}
