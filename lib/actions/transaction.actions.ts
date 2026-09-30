"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { parseStringify } from "../utils";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

const TRANSACTION_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [Query.equal("senderBankId", bankId)],
    );

    const receiverTransactions = await database.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [Query.equal("receiverBankId", bankId)],
    );

    const transactions = {
      total:
        senderTransactions.total +
        receiverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...receiverTransactions.documents,
      ],
    };

    return parseStringify(transactions);
  } catch (error) {
    console.error("GET TRANSACTIONS BY BANK ERROR:", error);
    throw error;
  }
};