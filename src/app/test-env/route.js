export async function GET() {
  return Response.json({
    NEXT_PUBLIC_EPAYCO_PUBLIC_KEY: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
    NEXT_PUBLIC_EPAYCO_TEST: process.env.NEXT_PUBLIC_EPAYCO_TEST,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  });
}
