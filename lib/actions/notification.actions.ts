"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { parseStringify } from "../utils";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const NOTIFICATION_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!;

export const createNotification = async ({
  userId,
  title,
  message,
  type,
  reference = "",
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  reference?: string;
}) => {
  try {
    const { database } = await createAdminClient();

    const notification = await database.createDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        title,
        message,
        type,
        read: false,
        reference,
      }
    );

    return parseStringify(notification);
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
    throw error;
  }
};