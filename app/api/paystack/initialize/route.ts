import { NextRequest, NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/actions/paystack.actions";
import { createSessionClient } from "@/lib/appwrite";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { amount } = body;

    if (!amount || Number(amount) < 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter an amount of at least ₦100",
        },
        { status: 400 }
      );
    }

    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in before funding your account",
        },
        { status: 401 }
      );
    }

    const currentUser = await sessionClient.account.get();

    const callbackUrl =
      `${request.nextUrl.origin}/api/paystack/callback`;

    const result = await initializePaystackTransaction({
      email: currentUser.email,
      amount: Number(amount),
      callbackUrl,
      userId: currentUser.$id,
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
