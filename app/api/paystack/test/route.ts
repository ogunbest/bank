import { NextResponse } from "next/server";
import paystack from "@/lib/paystack";

export async function GET() {
  try {
    const response = await paystack.get("/balance");

    return NextResponse.json({
      success: true,
      message: "Paystack connection is working",
      data: response.data,
    });
  } catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Paystack connection failed";

  console.error("PAYSTACK ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Paystack connection failed",
      error: message,
    },
    { status: 500 }
  );
 }
}
