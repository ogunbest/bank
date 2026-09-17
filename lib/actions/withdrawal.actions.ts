"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { createNotification } from "@/lib/actions/notification.actions";
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USER_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
const BANK_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID!;
const TRANSACTION_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

type WithdrawalParams = {
  bankId: string;
  amount: number;
};

export const createWithdrawal = async ({
  bankId,
  amount,
}: WithdrawalParams) => {
  try {
    // 1. Verify logged-in user
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    const currentUser = await sessionClient.account.get();
    const userId = currentUser.$id;

    const { database } = await createAdminClient();

    // 2. Validate amount
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter a valid withdrawal amount.");
    }

    // 3. Get user's profile
    const users = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", [userId])]
    );

    if (users.total !== 1) {
      throw new Error("User profile not found.");
    }

    const user = users.documents[0];

    // 4. Check current balance
    const currentBalance = Number(user.balance ?? 0);

    if (amount > currentBalance) {
      throw new Error("Insufficient balance.");
    }

    // 5. Verify bank account belongs to this user
    const banks = await database.listDocuments(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      [
        Query.equal("$id", [bankId]),
        Query.equal("userId", [userId]),
      ]
    );

    if (banks.total !== 1) {
      throw new Error("Bank account not found.");
    }

    const bank = banks.documents[0];

    // 6. Calculate new balance
    const newBalance = currentBalance - amount;

    // 7. Update balance
    await database.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id,
      {
        balance: newBalance,
      }
    );

    // 8. Create withdrawal transaction
    const reference = `WD-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    await database.createDocument(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      ID.unique(),
      {
        userId,

        type: "withdrawal",
        title: "Bank Withdrawal",
        amount,
        status: "success",
        reference,
        date: new Date().toISOString(),

        senderId: userId,
        receiverId: bank.$id,

        senderName:
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
          currentUser.name ||
          "Horizon User",

        receiverName: bank.accountName || "Bank Account",

        senderEmail: user.email || currentUser.email || "",
        receiverEmail: "",

        channel: "bank",
        currency: "NGN",
        fees: 0,

        
      }
    );
    await createNotification({
  userId,
  title: "Withdrawal successful",
  message: `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} has been withdrawn from your account.`,
  type: "withdrawal",
  reference,
});

console.log("=== WITHDRAWAL NOTIFICATION CREATED ===");

    console.log("=== WITHDRAWAL SUCCESS ===");
    console.log({
      userId,
      amount,
      previousBalance: currentBalance,
      newBalance,
      bankId,
      reference,
    });

    return {
      success: true,
      reference,
      amount,
      previousBalance: currentBalance,
      newBalance,
    };
  } catch (error) {
    console.error("=== WITHDRAWAL ERROR ===");
    console.error(error);

    throw error;
  }
};