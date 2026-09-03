'use server';

import { ID, Query } from "node-appwrite";
import {
  createAdminClient,
  createSessionClient,
  createClient,
} from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";


const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
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

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);
    return null;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createClient();

    const session = await account.createEmailPasswordSession(
      email,
      password
    );

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    const user = await getUserInfo({
      userId: session.userId,
    });

    if (!user) {
      throw new Error("User profile not found");
    }

    return parseStringify(user);
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
}


export const signUp = async ({ password, ...userData }: SignUpParams) => {
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

    return parseStringify(newUser);

  } catch (error) {
    console.error("=== SIGN UP ERROR ===");
    console.error(error);

    return null;
  }
};



export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}
export const createLinkToken = async (user: any) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: [Products.Auth],
      language: "en",
      country_codes: [CountryCode.Us],
    });

    return parseStringify({
      linkToken: tokenResponse.data.link_token,
    });
  } catch (error) {
    console.error("Error creating Plaid link token:", error);
    return null;
  }
};
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // 1. Exchange the Plaid public token for an access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // 2. Get the user's bank account from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    if (!accountData) {
      throw new Error("No bank account found");
    }

    // 3. Save the connected bank account to Appwrite
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl: "",
      shareableId: encryptId(accountData.account_id),
    });

    // 4. Refresh the dashboard
    revalidatePath("/");

    // 5. Return success
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while exchanging token:", error);
    return null;
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

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
    const { account } = await createSessionClient();

    await account.deleteSession("current");

    cookies().delete("appwrite-session");

    return true;
  } catch (error) {
    console.log("Error logging out:", error);
    return false;
  }
};