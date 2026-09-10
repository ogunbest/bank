'use server';

import { ID, Query } from "node-appwrite";
import {
  createAdminClient,
  createSessionClient,
  createClient,
} from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({
  userId,
}: getUserInfoProps): Promise<User | null> => {
  try {
    const { database } = await createAdminClient();

    console.log("DATABASE_ID:", DATABASE_ID);
    console.log("USER_COLLECTION_ID:", USER_COLLECTION_ID);
    console.log("USER_ID:", userId);
    console.log("APPWRITE_KEY_EXISTS:", !!process.env.NEXT_APPWRITE_KEY);

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

   console.log("USER DOCUMENTS:", user.documents);

if (user.total === 0) {
  return null;
}

return parseStringify(user.documents[0]) as unknown as User;
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);
    return null;
  }
};


export const signIn = async ({ email, password }: signInProps) => {
  try {
    console.log("=== SIGN IN START ===");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
          "X-Appwrite-Key": process.env.NEXT_APPWRITE_KEY!,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    console.log("=== RAW APPWRITE RESPONSE ===");
    console.log("STATUS:", response.status);

    const setCookie = response.headers.get("set-cookie");

    console.log("SET-COOKIE EXISTS:", !!setCookie);

    console.log(
      "SET-COOKIE NAME:",
      setCookie?.split("=")[0] ?? "NONE"
    );

    console.log(
      "SET-COOKIE LENGTH:",
      setCookie?.length ?? 0
    );

    console.log(
      "X-FALLBACK-COOKIES EXISTS:",
      !!response.headers.get("x-fallback-cookies")
    );

    console.log(
      "X-FALLBACK-COOKIES LENGTH:",
      response.headers.get("x-fallback-cookies")?.length ?? 0
    );

    const session = await response.json();

    console.log("SESSION ID:", session.$id);
    console.log("SESSION USER ID:", session.userId);
    console.log("SECRET EXISTS:", !!session.secret);
    console.log("SECRET LENGTH:", session.secret?.length ?? 0);

    if (!response.ok) {
      throw new Error(
        session.message || "Appwrite sign-in failed"
      );
    }

    if (!setCookie) {
      throw new Error("Appwrite did not return a session cookie.");
    }

    // Extract only the cookie value
    const appwriteCookie = setCookie
      .split(";")[0]
      .split("=")
      .slice(1)
      .join("=");

    if (!appwriteCookie) {
      throw new Error("Could not extract Appwrite session cookie.");
    }

    console.log(
      "APPWRITE COOKIE VALUE LENGTH:",
      appwriteCookie.length
    );

    console.log(
      "APPWRITE COOKIE VALUE START:",
      appwriteCookie.substring(0, 10)
    );

    cookies().set("appwrite-session", appwriteCookie, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("=== SESSION COOKIE SET ===");

    const user = await getUserInfo({
      userId: session.userId,
    });

    if (!user) {
      throw new Error("User profile not found");
    }

    console.log("=== SIGN IN SUCCESS ===");

    return parseStringify(user);
  } catch (error) {
    console.error("=== SIGN IN ERROR ===");
    console.error(error);

    return null;
  }
};



export const signUp = async ({
  password,
  ...userData
}: SignUpParams): Promise<User | null> => {
   const { email, firstName, lastName } = userData;

  try {
    console.log("=== SIGN UP START ===");
    console.log("Email:", email);
    console.log("Database ID:", DATABASE_ID);
    console.log("Collection ID:", USER_COLLECTION_ID);
    console.log("API key exists:", !!process.env.NEXT_APPWRITE_KEY);

    // 1. Create Appwrite account
    const { account } = await createClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    console.log("APPWRITE ACCOUNT CREATED:", newUserAccount.$id);

// 2. Create user profile document
const { database } = await createAdminClient();

const newUser = await database.createDocument(
  DATABASE_ID!,
  USER_COLLECTION_ID!,
  ID.unique(),
  {
    ...userData,
    userId: newUserAccount.$id,
    role: "Customer",
  }
);
    console.log("USER PROFILE CREATED:", newUser.$id);

    // 3. Create login session
    const session = await account.createEmailPasswordSession(
      email,
      password
    );

    console.log("SESSION CREATED:", session.$id);

    cookies().set("appwrite-session", session.secret, {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

    console.log("=== SIGN UP SUCCESS ===");

    return parseStringify(newUser) as unknown as User;

  } catch (error) {
    console.error("=== SIGN UP ERROR ===");
    console.error(error);

    return null;
  }
};



export const createBankAccount = async ({
  userId,
  bankCode,
  bankName,
  accountNumber,
  accountName,
}: CreateBankAccountParams) => {
  try {
    console.log("=== CREATE BANK ACCOUNT START ===");
    console.log("BANK COLLECTION ID:", BANK_COLLECTION_ID);
    console.log("USER ID:", userId);
    console.log("BANK CODE:", bankCode);
    console.log("BANK NAME:", bankName);
    console.log("ACCOUNT NUMBER:", accountNumber);

    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankCode,
        bankName,
        accountNumber,
        accountName,
      }
    );

    console.log("=== BANK ACCOUNT CREATED ===");
    console.log("BANK DOCUMENT ID:", bankAccount.$id);

    return parseStringify(bankAccount);
  } catch (error) {
    console.error("=== CREATE BANK ACCOUNT ERROR ===");
    console.error(error);
    throw error;
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    console.log("=== GET BANKS START ===");
    console.log("LOOKING FOR BANKS FOR USER:", userId);
    console.log("BANK COLLECTION ID:", BANK_COLLECTION_ID);

    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    console.log("BANKS FOUND:", banks.total);
    console.log("BANK DOCUMENTS:", banks.documents);

    return parseStringify(banks.documents);
  } catch (error) {
    console.error("=== GET BANKS ERROR ===");
    console.error(error);
    return [];
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}
export const getLoggedInUser = async () => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      return null;
    }

    const { account } = sessionClient;

    const currentUser = await account.get();

    const user = await getUserInfo({
      userId: currentUser.$id,
    });

    return parseStringify(user);
  } catch (error) {
    console.log("Error getting logged in user:", error);
    return null;
  }
}
export const logoutAccount = async () => {
  try {
    const sessionClient = await createSessionClient();

   if (!sessionClient) {
  return false;
}
    const { account } = sessionClient;

    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
  }
};