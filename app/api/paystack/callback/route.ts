import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/actions/paystack.actions";

export async function GET(request: NextRequest) {
  const reference =
    request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      new URL(
        "/dashboard?payment=failed",
        request.url
      )
    );
  }

  try {
    const result =
      await verifyPaystackTransaction(reference);

    if (!result.success) {
      throw new Error(
        "Payment verification failed"
      );
    }

    return NextResponse.redirect(
      new URL(
        `/dashboard?payment=success&amount=${result.amount}`,
        request.url
      )
    );
  } catch (error: unknown) {
    console.error(
      "PAYSTACK CALLBACK ERROR:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/dashboard?payment=failed",
        request.url
      )
    );
  }
}