import type { Metadata } from "next";
import PaymentOutcomePage from "@/app/response/PaymentOutcomePage";
import type { EpaycoSearchParams } from "@/lib/epayco";

// The ePayco panel's "URL de Respuesta" points here, so this is the page the
// customer actually lands on after paying. It shares its implementation with
// /response so both entry points behave identically.
export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<EpaycoSearchParams>;
};

export default function GraciasPage({ searchParams }: Props) {
  return <PaymentOutcomePage searchParams={searchParams} />;
}
