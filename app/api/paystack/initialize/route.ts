import { NextRequest, NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/actions/paystack.actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, amount } = body;

    if (!email || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and amount are required",
        },
        { status: 400 }
      );
    }

    const result = await initializePaystackTransaction({
      email,
      amount: Number(amount),
    });

    return NextResponse.json({
      success: true,
      message: "Payment initialized",
      data: result,
    });
  } catch (error: unknown) {
    console.error(
      "PAYSTACK INITIALIZATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
  error instanceof Error
    ? error.message
    : "Payment initialization failed",
      },
      { status: 500 }
    );
  }
}