declare module "epayco-sdk-node" {
  interface EpaycoConfig {
    apiKey: string;
    privateKey: string;
    lang?: "ES" | "EN";
    test?: boolean;
  }

  interface CheckoutData {
    name: string;
    description: string;
    invoice: string;
    currency: string;
    amount: number | string;
    tax_base: string;
    tax: string;
    country: string;
    external?: string;
    response?: string;
    confirmation?: string;
    method?: "POST" | "GET";
    [key: string]: unknown;
  }

  interface EpaycoInstance {
    checkout: {
      create(data: CheckoutData): Promise<unknown>;
    };
  }

  function epayco(config: EpaycoConfig): EpaycoInstance;

  export = epayco;
}
