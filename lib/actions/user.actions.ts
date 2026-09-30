'use server';

import { ID, Query } from "node-appwrite";

import crypto from "crypto";
import {
  createAdminClient,
  createSessionClient,
  createClient,
} from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USER_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
const BANK_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID!;

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

    // Check whether the admin has disabled this account
    if ((user as { status?: string }).status?.trim().toLowerCase() === "disabled") {
      cookies().delete("appwrite-session");

      throw new Error(
        "Your account has been disabled. Please contact support."
      );
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



const createBankAccount = async ({
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
    const existingBanks = await database.listDocuments(
  DATABASE_ID,
  BANK_COLLECTION_ID,
  [
    Query.equal("userId", [userId]),
    Query.equal("accountNumber", [accountNumber]),
  ],
);

if (existingBanks.documents.length > 0) {
  throw new Error(
    "This bank account is already linked to your account.",
  );
}

  const bankAccount = await database.createDocument(
  DATABASE_ID!,
  BANK_COLLECTION_ID!,
  ID.unique(),
  {
  userId,
  bankId: bankCode,
  shareableId: ID.unique(),
  accessToken: "",
  accountId: accountNumber,
  bankName,
  bankCode,
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
export const createBankAccountForCurrentUser = async ({
  bankCode,
  bankName,
  accountNumber,
  accountName,
}: Omit<CreateBankAccountParams, "userId">) => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    const currentUser = await sessionClient.account.get();

    return await createBankAccount({
      userId: currentUser.$id,
      bankCode,
      bankName,
      accountNumber,
      accountName,
    });
  } catch (error) {
    console.error("=== CREATE CURRENT USER BANK ERROR ===");
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
    console.log("=== LOGOUT START ===");

    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      console.log("NO SESSION CLIENT");
      return false;
    }

    const { account } = sessionClient;

    await account.deleteSession("current");

    cookies().delete("appwrite-session");

    console.log("=== LOGOUT SUCCESS ===");

    return true;
  } catch (error) {
    console.error("=== LOGOUT ERROR ===");
    console.error(error);
    return false;
  }
};

export const getAllUsers = async () => {
  try {
    const { database } = await createAdminClient();

    const users = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      []
    );

    return parseStringify(users.documents);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    return [];
  }
};

export const getAllBankAccounts = async () => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      []
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.error("GET ALL BANK ACCOUNTS ERROR:", error);
    return [];
  }
};

export const getAllTransactions = async () => {
  try {
    const { database } = await createAdminClient();

    const transactions = await database.listDocuments(
      DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!,
      []
    );

    return parseStringify(transactions.documents);
  } catch (error) {
    console.error("GET ALL TRANSACTIONS ERROR:", error);
    return [];
  }
};

export const updateUserStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: "active" | "disabled";
}) => {
  try {
    const admin = await getLoggedInUser();

    if (!admin || admin.role?.trim().toLowerCase() !== "admin") {
      throw new Error("Unauthorized");
    }

    const { database } = await createAdminClient();

    const updatedUser = await database.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userId,
      {
        status,
      }
    );

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);
    throw error;
  }
};

export const getTransaction = async ({
transactionId,
}: {
transactionId: string;
}) => {
try {
const { database } = await createAdminClient();


const transaction = await database.getDocument(
  DATABASE_ID,
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!,
  transactionId
);

return parseStringify(transaction);


} catch (error) {
console.error("GET TRANSACTION ERROR:", error);
return null;
}
};

export const updateCurrentUserProfile = async ({
  firstName,
  lastName,
  phone,
  address,
  city,
  state,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}) => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    const currentUser = await sessionClient.account.get();

    const { database } = await createAdminClient();

    const users = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal("userId", [currentUser.$id])]
    );

    if (users.total !== 1) {
      throw new Error("User profile not found.");
    }

    const userProfile = users.documents[0];

    const updatedUser = await database.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userProfile.$id,
      {
  firstName: firstName.trim(),
  lastName: lastName.trim(),
  phone: phone.trim(),
  address1: address.trim(),
  city: city.trim(),
  state: state.trim(),
}
    );

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("UPDATE CURRENT USER PROFILE ERROR:", error);
    throw error;
  }
};

export const updateCurrentUserPassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    if (!currentPassword || !newPassword) {
      throw new Error("Both password fields are required.");
    }

    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }

    if (currentPassword === newPassword) {
      throw new Error(
        "New password must be different from your current password."
      );
    }

    await sessionClient.account.updatePassword(
      newPassword,
      currentPassword
    );

    return {
      success: true,
      message: "Password updated successfully.",
    };
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Could not update your password.");
  }
};

export const deleteBankAccountForCurrentUser = async (
  bankId: string
) => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("You must be logged in.");
    }

    const currentUser = await sessionClient.account.get();

    const { database } = await createAdminClient();

    const TRANSACTION_COLLECTION_ID =
      process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

    // Make sure the bank account belongs to the logged-in user.
    const banks = await database.listDocuments(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      [
        Query.equal("$id", [bankId]),
        Query.equal("userId", [currentUser.$id]),
      ]
    );

    if (banks.total !== 1) {
      throw new Error("Bank account not found.");
    }

    // Prevent deletion if the account has withdrawal records.
    const transactions = await database.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [
        Query.equal("receiverId", [bankId]),
      ]
    );

    if (transactions.documents.length > 0) {
      throw new Error(
        "This bank account has transaction records and cannot be removed."
      );
    }

    await database.deleteDocument(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      bankId
    );

    return {
      success: true,
      message: "Bank account removed successfully.",
    };
  } catch (error) {
    console.error("DELETE BANK ACCOUNT ERROR:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Could not remove bank account.");
  }
};

export const setTransactionPin = async (pin: string) => {
  if (!/^\d{4,6}$/.test(pin)) {
    throw new Error("Transaction PIN must be 4 to 6 digits.");
  }

  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    throw new Error("You must be signed in.");
  }

  const currentUser = await sessionClient.account.get();
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("userId", [currentUser.$id])]
  );

  if (users.total !== 1) {
    throw new Error("Your profile was not found.");
  }

  const user = users.documents[0];

  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(pin, salt, 64)
    .toString("hex");

  const transactionPinHash = `${salt}:${hash}`;

  const updatedUser = await database.updateDocument(
    DATABASE_ID,
    USER_COLLECTION_ID,
    user.$id,
    {
      transactionPinHash,
      transactionPinSet: true,
    }
  );

  console.log("=== TRANSACTION PIN SAVED ===");
  console.log("USER:", currentUser.$id);
  console.log("PIN SET:", updatedUser.transactionPinSet);
  console.log(
    "PIN HASH EXISTS:",
    !!updatedUser.transactionPinHash
  );

  if (
    updatedUser.transactionPinSet !== true ||
    !updatedUser.transactionPinHash
  ) {
    throw new Error("Transaction PIN could not be activated.");
  }

  return {
    success: true,
    transactionPinSet: true,
  };
};

export const verifyTransactionPin = async (pin: string) => {
  if (!/^\d{4,6}$/.test(pin)) {
    throw new Error("Invalid transaction PIN.");
  }

  const sessionClient = await createSessionClient();

  if (!sessionClient) {
    throw new Error("You must be signed in.");
  }

  const currentUser = await sessionClient.account.get();
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID,
    USER_COLLECTION_ID,
    [Query.equal("userId", currentUser.$id)],
  );

  if (users.documents.length === 0) {
    throw new Error("Your profile was not found.");
  }

const user = users.documents[0];

console.log("=== TRANSACTION PIN CHECK ===");
console.log("USER DOCUMENT ID:", user.$id);
console.log("TRANSACTION PIN SET:", user.transactionPinSet);
console.log(
  "TRANSACTION PIN HASH EXISTS:",
  !!user.transactionPinHash
);
console.log(
  "TRANSACTION PIN HASH LENGTH:",
  String(user.transactionPinHash || "").length
);

if (!user.transactionPinSet || !user.transactionPinHash) {
    throw new Error("Please set your transaction PIN first.");
  }

  const [salt, storedHash] =
    String(user.transactionPinHash).split(":");

  if (!salt || !storedHash) {
    throw new Error("Transaction PIN is not configured correctly.");
  }

  const hash = crypto
    .scryptSync(pin, salt, 64)
    .toString("hex");

  const isValid =
    storedHash.length === hash.length &&
    crypto.timingSafeEqual(
      Buffer.from(storedHash, "hex"),
      Buffer.from(hash, "hex"),
    );

 if (!isValid) {
  throw new Error("Incorrect transaction PIN.");
}

return {
  success: true,
  transactionPinSet: true,
};
};

