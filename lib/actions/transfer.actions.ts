"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

export async function transferMoney({
  recipientEmail,
  amount,
  note,
}: {
  recipientEmail: string;
  amount: number;
  note?: string;
}) {
  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    throw new Error("You must be signed in.");
  }

  const currentUser = await sessionClient.account.get();
  const { database } = await createAdminClient();

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const userCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
  const transactionCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

  // Find sender profile
  const senderResult = await database.listDocuments(
    databaseId,
    userCollectionId,
    [Query.equal("userId", currentUser.$id)],
  );

  if (senderResult.documents.length === 0) {
    throw new Error("Your profile was not found.");
  }

  const sender = senderResult.documents[0];

  // Find recipient
  const recipientResult = await database.listDocuments(
    databaseId,
    userCollectionId,
    [Query.equal("email", recipientEmail.trim().toLowerCase())],
  );

  if (recipientResult.documents.length === 0) {
    throw new Error("Recipient account was not found.");
  }

  const recipient = recipientResult.documents[0];

  if (recipient.userId === currentUser.$id) {
    throw new Error("You cannot transfer money to yourself.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid transfer amount.");
  }

  const senderBalance = Number(sender.balance ?? 0);
  console.log("TRANSFER SENDER:", {
  authUserId: currentUser.$id,
  profileId: sender.$id,
  email: sender.email,
  balance: sender.balance,
  senderBalance,
  requestedAmount: amount,
});

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
    Math.random() * 100000,
  )}`;

  // Deduct sender balance
  await database.updateDocument(
    databaseId,
    userCollectionId,
    sender.$id,
    {
      balance: senderBalance - amount,
    },
  );

  // Add recipient balance
  await database.updateDocument(
    databaseId,
    userCollectionId,
    recipient.$id,
    {
      balance: Number(recipient.balance ?? 0) + amount,
    },
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
        ? `Transfer to ${recipientName || recipientEmail}: ${note.trim()}`
        : `Transfer to ${recipientName || recipientEmail}`,
      amount,
      status: "success",
      reference,
      date: new Date().toISOString(),
      senderId: currentUser.$id,
      receiverId: recipient.userId,
      senderName: senderName || currentUser.name || "Customer",
      receiverName: recipientName || recipientEmail,
      senderEmail: sender.email || currentUser.email,
      receiverEmail: recipient.email || recipientEmail,
      paystackTransactionId: 0,
      channel: "internal",
      currency: "NGN",
      fees: 0,
      paidAt: new Date().toISOString(),

    },
  );

  // Receiver transaction
  await database.createDocument(
    databaseId,
    transactionCollectionId,
    ID.unique(),
    {
      userId: recipient.userId,
      type: "transfer",
      title: `Transfer from ${senderName || currentUser.email}`,
      amount,
      status: "success",
      reference,
      date: new Date().toISOString(),
      senderId: currentUser.$id,
      receiverId: recipient.userId,
      senderName: senderName || currentUser.name || "Customer",
      receiverName: recipientName || recipientEmail,
      senderEmail: sender.email || currentUser.email,
      receiverEmail: recipient.email || recipientEmail,
      paystackTransactionId: 0,
      channel: "internal",
      currency: "NGN",
      fees: 0,
      paidAt: new Date().toISOString(),

    },
  );

  return {
    success: true,
    reference,
    amount,
    newBalance: senderBalance - amount,
  };
}