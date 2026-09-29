// Canonical origin for the storefront. Change the domain here, not in each file.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cglabs.fit"
).replace(/\/+$/, "");

// The ePayco panel's "URL de Respuesta" points to /gracias, so the session
// sends the same path. Under Smart Checkout the session value is what actually
// decides where the customer lands, because the session is created after the
// panel is read. Keeping both in sync avoids a silent mismatch.
export const RESPONSE_URL = `${SITE_URL}/gracias`;
export const CONFIRMATION_URL = `${SITE_URL}/confirmation`;
