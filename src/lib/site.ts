// Canonical origin for the storefront. Change the domain here, not in each file.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cglabs.fit"
).replace(/\/+$/, "");

export const RESPONSE_URL = `${SITE_URL}/response`;
export const CONFIRMATION_URL = `${SITE_URL}/confirmation`;
