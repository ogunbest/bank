import { NextResponse } from "next/server";
import { createDedicatedVirtualAccount } from "@/lib/actions/paystack.actions";

export async function GET() {
  try {
    const result = await createDedicatedVirtualAccount(
      "CUS_316vi9di88awtbr"
    );

    return NextResponse.json({
      success: true,
      message: "Virtual account created",
      data: result,
    });
 } catch (error: unknown) {
  console.error("VIRTUAL ACCOUNT TEST ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Virtual account creation failed",
    },
    { status: 500 }
  );
}
}