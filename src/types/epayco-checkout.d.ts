// Global type for the ePayco Smart Checkout script
// (loaded via https://checkout.epayco.co/checkout-v2.js in the root layout).
//
// The session is created server-side by /api/epayco/create-session. The browser
// only receives its sessionId, so no public key and no order data cross into
// this call.

type EpaycoCheckoutType = "onpage" | "standard";

interface EpaycoCheckoutConfigureOptions {
  sessionId: string;
  type: EpaycoCheckoutType;
  test: boolean;
}

interface EpaycoCheckoutHandler {
  setHooks: (hooks: EpaycoCheckoutHooks) => void;
  open: () => void;
}

interface EpaycoCheckoutHooks {
  onCreated?: (data: unknown) => void;
  onResponse?: (response: unknown) => void;
  onErrors?: (error: unknown) => void;
  onClosed?: (errors?: unknown) => void;
}

interface EpaycoCheckoutApi {
  configure: (options: EpaycoCheckoutConfigureOptions) => EpaycoCheckoutHandler;
}

interface EpaycoGlobal {
  checkout: EpaycoCheckoutApi;
}

interface Window {
  ePayco?: EpaycoGlobal;
}
