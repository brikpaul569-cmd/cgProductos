import type { Metadata } from "next";
import PaymentOutcomePage from "./PaymentOutcomePage";
import type { EpaycoSearchParams } from "@/lib/epayco";

export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<EpaycoSearchParams>;
};

export default function ResponsePage({ searchParams }: Props) {
  return <PaymentOutcomePage searchParams={searchParams} />;
}
