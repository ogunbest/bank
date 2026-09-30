"use server";

import { Query } from "node-appwrite";
import { unstable_noStore } from "next/cache";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite";

type AppwriteDocument = Record<string, unknown> & {
  $id: string;
  $createdAt?: string;
};

const asText = (value: unknown) =>
  typeof value === "string" ? value : "";

const asNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return "Not available";

  return `•••• ${accountNumber.slice(-4)}`;
};

const getDirection = (
  transaction: AppwriteDocument,
  userId: string,
): "in" | "out" => {
  if (asText(transaction.receiverId) === userId) return "in";
  if (asText(transaction.senderId) === userId) return "out";

  const type = asText(transaction.type).toLowerCase();

  if (["deposit", "credit", "refund", "incoming"].includes(type)) {
    return "in";
  }

  if (["withdrawal", "debit", "payment", "transfer", "outgoing"].includes(type)) {
    return "out";
  }

  return asText(transaction.senderBankId) ? "out" : "in";
};


  export async function getDashboardData() { unstable_noStore();
  const sessionClient = await createSessionClient();

if (!sessionClient) {
  return null;
}

let currentUser;

try {
  currentUser = await sessionClient.account.get();
} catch (error) {
  console.error("NO ACTIVE APPWRITE SESSION:", error);
  return null;
}

  const { database } = await createAdminClient();

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const userCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
  const transactionCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;
  const bankCollectionId = process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID;

  const users = await database.listDocuments(
    databaseId,
    userCollectionId,
    [Query.equal("userId", currentUser.$id)],
  );

  if (users.documents.length === 0) {
    console.log("DASHBOARD PROFILE:", {
  authUserId: currentUser.$id,
  profileId: users.documents[0].$id,
  email: users.documents[0].email,
  balance: users.documents[0].balance,
});
    throw new Error("User profile not found");
  }

  const user = users.documents[0] as AppwriteDocument;

  const transactionResult = await database.listDocuments(
  databaseId,
  transactionCollectionId,
  [Query.equal("userId", currentUser.$id)],
);

const transactionDocuments = new Map<string, AppwriteDocument>();

for (const document of transactionResult.documents as AppwriteDocument[]) {
  transactionDocuments.set(document.$id, document);
}

  let bankDocuments: AppwriteDocument[] = [];

  if (bankCollectionId) {
    try {
      const banks = await database.listDocuments(databaseId, bankCollectionId, [
        Query.equal("userId", currentUser.$id),
      ]);

      bankDocuments = banks.documents as AppwriteDocument[];
    } catch (error) {
      console.error("Unable to load linked bank accounts:", error);
    }
  }

  const transactions = Array.from(transactionDocuments.values())
    .map((transaction) => {
      const rawType = asText(transaction.type).toLowerCase();
      const direction = getDirection(transaction, currentUser.$id);

      return {
  id: transaction.$id,
  title:
    asText(transaction.title) ||
    asText(transaction.name) ||
    "Account transaction",
  type: rawType || (direction === "in" ? "deposit" : "transfer"),
  direction,
  amount: asNumber(transaction.amount),
  status: asText(transaction.status) || "success",
  reference: asText(transaction.reference) || transaction.$id,
  date: asText(transaction.date) || transaction.$createdAt || "",
  category: asText(transaction.category) || "Uncategorised",
  channel: asText(transaction.channel) || "online",
  currency: asText(transaction.currency) || "NGN",
  fees: asNumber(transaction.fees),
};
    })
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    );

  const accounts = bankDocuments.map((bank) => {
    const accountNumber = asText(bank.accountNumber);

    return {
      id: bank.$id,
      bankName: asText(bank.bankName) || "Linked bank account",
      accountName: asText(bank.accountName) || "Account holder",
      accountNumber:
        asText(bank.accountNumberMasked) || maskAccountNumber(accountNumber),
      createdAt: bank.$createdAt || "",
    };
  });

  const firstName = asText(user.firstName);
  const lastName = asText(user.lastName);

  return {
  balance: asNumber(user.balance),

  user: {
    name:
      `${firstName} ${lastName}`.trim() ||
      currentUser.name ||
      "Customer",

    email:
      asText(user.email) ||
      currentUser.email,

    transactionPinSet:
      user.transactionPinSet === true,
  },

  accounts,
  transactions,
};
}
