"use server";

import paystack from "@/lib/paystack";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";

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
  callbackUrl,
  userId,
}: {
  email: string;
  amount: number;
  callbackUrl: string;
  userId: string;
}) {
  try {
    const response = await paystack.post(
      "/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          appwriteUserId: userId,
        },
      }
    );

    console.log(
      "PAYSTACK TRANSACTION INITIALIZED:"
    );
    console.log(response.data);

    return response.data;
  } catch (error: unknown) {
    console.error(
      "PAYSTACK TRANSACTION ERROR:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to initialize Paystack transaction"
    );
  }
}

export async function verifyPaystackTransaction(
  reference: string
) {
  try {
    const response = await paystack.get(
      `/transaction/verify/${reference}`
    );

    const transaction = response.data.data;

    console.log(
      "PAYSTACK VERIFIED TRANSACTION:"
    );
    console.log(transaction);

    if (transaction.status !== "success") {
      throw new Error(
        "Paystack transaction was not successful"
      );
    }

    console.log("STEP 1: PAYSTACK VERIFIED");
    console.log("REFERENCE:", reference);

    const metadata = transaction.metadata as
      | { appwriteUserId?: unknown }
      | undefined;
    let userId =
      typeof metadata?.appwriteUserId === "string"
        ? metadata.appwriteUserId
        : "";

    if (!userId) {
      const sessionClient = await createSessionClient();

      if (!sessionClient) {
        throw new Error("No active session");
      }

      userId = (await sessionClient.account.get()).$id;
    }

    console.log(
      "STEP 3: CURRENT USER:",
      userId
    );

    const { database } =
      await createAdminClient();

    console.log(
      "STEP 4: ADMIN CLIENT CREATED"
    );

    const existingTransactions = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!,
      [Query.equal("reference", reference)]
    );

    if (existingTransactions.documents.length > 0) {
      const existingTransaction = existingTransactions.documents[0];

      return {
        success: true,
        reference,
        amount: Number(existingTransaction.amount ?? 0),
        previousBalance: null,
        newBalance: null,
        alreadyProcessed: true,
      };
    }

    const users =
      await database.listDocuments(
        process.env
          .NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env
          .NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
        [
          Query.equal("userId", userId),
        ]
      );

    console.log(
      "STEP 5: USER DOCUMENTS FOUND:",
      users.documents.length
    );

    if (users.documents.length === 0) {
      throw new Error(
        "User profile not found"
      );
    }

    const userDocument =
      users.documents[0];

    console.log(
      "STEP 6: USER DOCUMENT:",
      userDocument
    );

    const currentBalance =
      Number(userDocument.balance ?? 0);

    const paidAmount =
      Number(transaction.amount) / 100;

    const newBalance =
      currentBalance + paidAmount;

    console.log(
      "STEP 7: BALANCE CALCULATION"
    );

    console.log({
      currentBalance,
      paidAmount,
      newBalance,
    });

    await database.updateDocument(
      process.env
        .NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env
        .NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
      userDocument.$id,
      {
        balance: newBalance,
      }
    );

    await database.createDocument(
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!,
  ID.unique(),
  {
    userId,
    type: "deposit",
    title: "Paystack Deposit",
    amount: paidAmount,
    status: "success",
    reference,
    date: new Date().toISOString(),
  }
);

console.log("STEP 8B: TRANSACTION CREATED");
 
    console.log(
      "STEP 8: BALANCE UPDATE SUCCESSFUL"
    );

    console.log({
      userId,
      previousBalance: currentBalance,
      paidAmount,
      newBalance,
    });

    return {
      success: true,
      reference,
      amount: paidAmount,
      previousBalance: currentBalance,
      newBalance,
    };
  } catch (error: unknown) {
    console.error(
      "PAYSTACK VERIFICATION ERROR:",
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to verify Paystack transaction"
    );
  }
}
