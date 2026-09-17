"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
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

export const getCurrentUserNotifications = async () => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      return [];
    }

    const currentUser = await sessionClient.account.get();

    const { database } = await createAdminClient();

    const notifications = await database.listDocuments(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      [
        Query.equal("userId", [currentUser.$id]),
        Query.orderDesc("$createdAt"),
      ]
    );

    return parseStringify(notifications.documents);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return [];
  }
};

export const markNotificationAsRead = async (
  notificationId: string
) => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    const currentUser = await sessionClient.account.get();

    const { database } = await createAdminClient();

    const notification = await database.getDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      notificationId
    );

    if (notification.userId !== currentUser.$id) {
      throw new Error("Unauthorized.");
    }

    const updatedNotification = await database.updateDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      notificationId,
      {
        read: true,
      }
    );

    return parseStringify(updatedNotification);
  } catch (error) {
    console.error("MARK NOTIFICATION READ ERROR:", error);
    throw error;
  }
};