"use server";

import paystack from "@/lib/paystack";

interface CreatePaystackCustomerParams {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

export async function createPaystackCustomer({
  email,
  firstName,
  lastName,
  phone,
}: CreatePaystackCustomerParams) {
  try {
    const response = await paystack.post("/customer", {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    console.log("PAYSTACK CUSTOMER CREATED:");
    console.log(response.data);

    return response.data;
  } catch (error: unknown) {
  console.error("PAYSTACK CUSTOMER ERROR:", error);

  throw new Error(
    error instanceof Error
      ? error.message
      : "Failed to create Paystack customer"
  );
}
}

export async function createDedicatedVirtualAccount(
  customerCode: string
) {
  try {
    const response = await paystack.post("/dedicated_account", {
      customer: customerCode,
      preferred_bank: "test-bank",
    });

    console.log("VIRTUAL ACCOUNT CREATED:");
    console.log(response.data);

    return response.data;
  } catch (error: unknown) {
  console.error("VIRTUAL ACCOUNT ERROR:", error);

  throw new Error(
    error instanceof Error
      ? error.message
      : "Failed to create virtual account"
  );
}
}

export async function initializePaystackTransaction({
  email,
  amount,
}: {
  email: string;
  amount: number;
}) {
  try {
    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100,
      currency: "NGN",
    });

    console.log("PAYSTACK TRANSACTION INITIALIZED:");
    console.log(response.data);

    return response.data;
  } catch (error: unknown) {
  console.error("PAYSTACK TRANSACTION ERROR:", error);

  throw new Error(
    error instanceof Error
      ? error.message
      : "Failed to initialize Paystack transaction"
  );
}
}