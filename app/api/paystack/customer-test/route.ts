import { NextResponse } from "next/server";
import { createPaystackCustomer } from "@/lib/actions/paystack.actions";

export async function GET() {
  try {
    const customer = await createPaystackCustomer({
      email: "ogunbestjos@gmail.com",
      firstName: "Test",
      lastName: "User",
      phone: "08000000000",
    });

    return NextResponse.json({
      success: true,
      message: "Paystack customer created",
      data: customer,
    });
  } catch (error: unknown) {
  console.error("CUSTOMER TEST ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Customer creation failed",
    },
    { status: 500 }
  );
 }
}