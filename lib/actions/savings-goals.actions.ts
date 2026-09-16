"use server";

import { ID, Query } from "node-appwrite";

import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

const COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_SAVINGS_GOALS_COLLECTION_ID!;

const USER_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;

export async function getSavingsGoals() {
  const session = await createSessionClient();

  if (!session) {
    return [];
  }

  const { account } = session;
  const user = await account.get();

  const { database } = await createAdminClient();

  const result = await database.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    [Query.equal("userId", user.$id)]
  );

  return result.documents;
}

export async function createSavingsGoal(
  name: string,
  targetAmount: number
) {
  const session = await createSessionClient();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { account } = session;
  const user = await account.get();

  const { database } = await createAdminClient();

  return await database.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      userId: user.$id,
      name,
      targetAmount,
      savedAmount: 0,
      createdAt: new Date().toISOString(),
    }
  );
}
export async function addToSavingsGoal(
  goalId: string,
  amount: number
) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const session = await createSessionClient();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { account } = session;
  const user = await account.get();

  const { database } = await createAdminClient();

  // Get user profile
  const users = await database.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("userId", user.$id)]
  );

  if (users.documents.length === 0) {
    throw new Error("User profile not found");
  }

  const userDocument = users.documents[0];

  const currentBalance = Number(
    userDocument.balance ?? 0
  );

  if (amount > currentBalance) {
    throw new Error("Insufficient balance");
  }

  // Get savings goal
  const goal = await database.getDocument(
    DATABASE_ID,
    COLLECTION_ID,
    goalId
  );

  if (goal.userId !== user.$id) {
    throw new Error(
      "You are not authorized to modify this goal"
    );
  }

  const newSavedAmount =
    Number(goal.savedAmount || 0) + amount;

  const newBalance =
    currentBalance - amount;

  // Deduct balance
  await database.updateDocument(
    DATABASE_ID,
    USER_COLLECTION_ID,
    userDocument.$id,
    {
      balance: newBalance,
    }
  );

  // Update savings goal
  const updatedGoal =
    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      goalId,
      {
        savedAmount: newSavedAmount,
      }
    );

  // Create transaction
  await database.createDocument(
    DATABASE_ID,
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!,
    ID.unique(),
    {
      userId: user.$id,

      type: "savings",

      title: `Savings: ${goal.name}`,

      category: "Savings",

      amount,

      status: "success",

      reference: `SAV-${ID.unique()}`,

      date: new Date().toISOString(),

      senderId: user.$id,

      senderName: [
        userDocument.firstName,
        userDocument.lastName,
      ]
        .filter(Boolean)
        .join(" "),

      senderEmail: userDocument.email || "",

      receiverId: goalId,

      receiverName: goal.name,

      receiverEmail: "",

      paystackTransactionId: 0,

      channel: "internal",

      currency: "NGN",

      fees: 0,

      paidAt: new Date().toISOString(),
    }
  );

  return updatedGoal;
}