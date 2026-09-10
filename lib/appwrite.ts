"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const cookieStore = cookies();
  const session = cookieStore.get("appwrite-session");

  if (!session?.value) {
    return null;
  }

  client.setSession(session.value);

  return {
    account: new Account(client),
  };
}

export async function createClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  return {
    account: new Account(client),
  };
}
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  console.log("APPWRITE ENDPOINT:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log("APPWRITE PROJECT:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
  console.log(
    "APPWRITE KEY LENGTH:",
    process.env.NEXT_APPWRITE_KEY?.length
  );

  return {
    account: new Account(client),
    database: new Databases(client),
    user: new Users(client),
  };
}