// Global type for the ePayco browser checkout script
// (loaded via https://checkout.epayco.co/checkout.js in the root layout).

interface EpaycoCheckoutConfigureOptions {
  key?: string;
  test?: boolean;
  lang?: string;
  external?: string;
}

interface EpaycoCheckoutHandler {
  open: (data: Record<string, unknown>) => void;
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
