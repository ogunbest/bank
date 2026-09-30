"use server";

import { ID, Query } from "node-appwrite";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite";
import { createNotification } from "@/lib/actions/notification.actions";

type TransferParams = {
  recipientAccountNumber: string;
  amount: number;
  note?: string;
};
export async function transferMoney({
  recipientAccountNumber,
  amount,
  note,
}: TransferParams) {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    throw new Error("You must be signed in.");
  }

  const currentUser = await sessionClient.account.get();
  const { database } = await createAdminClient();

  const databaseId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

  const userCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;

  const bankCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID!;

  const transactionCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid transfer amount.");
  }

  const cleanAccountNumber = recipientAccountNumber.trim();

  if (!/^\d{10}$/.test(cleanAccountNumber)) {
    throw new Error("Enter a valid 10-digit account number.");
  }

  // Find sender profile
  const senderResult = await database.listDocuments(
    databaseId,
    userCollectionId,
    [Query.equal("userId", [currentUser.$id])]
  );

  if (senderResult.documents.length === 0) {
    throw new Error("Your profile was not found.");
  }

  const sender = senderResult.documents[0];

  // Find recipient bank account
 const recipientBankResult =
  await database.listDocuments(
    databaseId,
    bankCollectionId,
    [
      Query.equal("accountNumber", [cleanAccountNumber]),
    ]
  );

  if (recipientBankResult.documents.length === 0) {
    throw new Error("Recipient account was not found.");
  }

  const recipientBank =
    recipientBankResult.documents[0];

  // Find recipient profile
  const recipientResult =
    await database.listDocuments(
      databaseId,
      userCollectionId,
      [
        Query.equal(
          "userId",
          [recipientBank.userId]
        ),
      ]
    );

  if (recipientResult.documents.length === 0) {
    throw new Error("Recipient profile was not found.");
  }

  const recipient = recipientResult.documents[0];

console.log("=== TRANSFER DEBUG ===");
console.log("CURRENT USER:", currentUser.$id);
console.log("RECIPIENT BANK USER:", recipientBank.userId);
console.log("RECIPIENT PROFILE USER:", recipient.userId);
console.log("RECIPIENT ACCOUNT:", cleanAccountNumber);
console.log(
  "RECIPIENT NAME:",
  recipient.firstName,
  recipient.lastName
);

if (recipient.userId === currentUser.$id) {
  throw new Error(
    "You cannot transfer money to yourself."
  );
}

  const senderBalance = Number(
    sender.balance ?? 0
  );

  if (amount > senderBalance) {
    throw new Error("Insufficient balance.");
  }

  const senderName = [
    sender.firstName,
    sender.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const recipientName = [
    recipient.firstName,
    recipient.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const reference = `TRF-${Date.now()}-${Math.floor(
    Math.random() * 100000
  )}`;

  const newSenderBalance =
    senderBalance - amount;

  const recipientBalance =
    Number(recipient.balance ?? 0);

  const newRecipientBalance =
    recipientBalance + amount;

  // Deduct sender balance
  await database.updateDocument(
    databaseId,
    userCollectionId,
    sender.$id,
    {
      balance: newSenderBalance,
    }
  );

  // Credit recipient balance
  await database.updateDocument(
    databaseId,
    userCollectionId,
    recipient.$id,
    {
      balance: newRecipientBalance,
    }
  );

  // Sender transaction
  await database.createDocument(
    databaseId,
    transactionCollectionId,
    ID.unique(),
    {
      userId: currentUser.$id,
      type: "transfer",
      title: note?.trim()
        ? `Transfer to ${recipientName}: ${note.trim()}`
        : `Transfer to ${recipientName}`,
      amount,
      status: "success",
      reference,
      date: new Date().toISOString(),
      senderId: currentUser.$id,
      receiverId: recipient.userId,
      senderName:
        senderName ||
        currentUser.name ||
        "Customer",
      receiverName:
        recipientName ||
        recipientBank.accountName ||
        "Customer",
      senderEmail:
        sender.email ||
        currentUser.email ||
        "",
      receiverEmail:
        recipient.email || "",
      paystackTransactionId: 0,
      channel: "internal",
      currency: "NGN",
      fees: 0,
      paidAt: new Date().toISOString(),
    }
  );

  // Recipient transaction
  await database.createDocument(
    databaseId,
    transactionCollectionId,
    ID.unique(),
    {
      userId: recipient.userId,
      type: "transfer",
      title: `Transfer from ${
        senderName ||
        currentUser.name ||
        "Customer"
      }`,
      amount,
      status: "success",
      reference,
      date: new Date().toISOString(),
      senderId: currentUser.$id,
      receiverId: recipient.userId,
      senderName:
        senderName ||
        currentUser.name ||
        "Customer",
      receiverName:
        recipientName ||
        recipientBank.accountName ||
        "Customer",
      senderEmail:
        sender.email ||
        currentUser.email ||
        "",
      receiverEmail:
        recipient.email || "",
      paystackTransactionId: 0,
      channel: "internal",
      currency: "NGN",
      fees: 0,
      paidAt: new Date().toISOString(),
    }
  );

  // Sender notification
  await createNotification({
    userId: currentUser.$id,
    title: "Transfer successful",
    message: `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} was sent to ${
      recipientName ||
      recipientBank.accountName ||
      "the recipient"
    }.`,
    type: "transfer_sent",
    reference,
  });

  // Recipient notification
  await createNotification({
    userId: recipient.userId,
    title: "Money received",
    message: `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} was received from ${
      senderName ||
      currentUser.name ||
      "Customer"
    }.`,
    type: "transfer_received",
    reference,
  });

  return {
    success: true,
    reference,
    amount,
    newBalance: newSenderBalance,
    recipientName:
      recipientName ||
      recipientBank.accountName ||
      "Customer",
    recipientBankName:
      recipientBank.bankName || "",
    recipientAccountNumber:
      cleanAccountNumber,
  };
}