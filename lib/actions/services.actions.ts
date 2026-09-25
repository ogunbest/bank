"use server";

import { ID, Query } from "node-appwrite";
import {
  createAdminClient,
  createSessionClient,
} from "@/lib/appwrite";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

const USER_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;

const TRANSACTION_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID!;

const BASE_URL =
  process.env.VTUNAIJA_BASE_URL ||
  "https://sandbox.vtunaija.com.ng/api";

const API_KEY = process.env.VTUNAIJA_API_KEY;

type ServiceResponse = {
  Status?: string;
  status?: string;
  message?: string;
  api_response?: string;
  id?: string;
  ident?: string;
  plan_amount?: string;
  transaction_internal_id?: string;
  pin?: string;
  serial?: string;
  token?: string;
  electricitytoken?: string;
  [key: string]: unknown;
};

function requestId() {
  return `COV-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

async function vtuRequest(
  endpoint: string,
  body: Record<string, string | number>
): Promise<ServiceResponse> {
  if (!API_KEY) {
    throw new Error("VTU Naija API key is not configured.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json()) as ServiceResponse;

  if (!response.ok) {
    throw new Error(
      String(
        data.message ||
          data.api_response ||
          "VTU service request failed."
      )
    );
  }

  return data;
}

async function getCurrentUser() {
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

  if (users.documents.length === 0) {
    throw new Error("User profile not found.");
  }

  return {
    authUserId: currentUser.$id,
    document: users.documents[0],
  };
}

async function createServiceTransaction({
  userId,
  title,
  amount,
  reference,
  status,
  category,
}: {
  userId: string;
  title: string;
  amount: number;
  reference: string;
  status: string;
  category: string;
}) {
  const { database } = await createAdminClient();

  return database.createDocument(
    DATABASE_ID,
    TRANSACTION_COLLECTION_ID,
    ID.unique(),
    {
      userId,
      title,
      type: "payment",
      direction: "out",
      amount,
      status,
      reference,
      date: new Date().toISOString(),
      category,
      channel: "VTU",
      currency: "NGN",
      fees: 0,
    }
  );
}

async function updateTransaction(
  transactionId: string,
  data: Record<string, unknown>
) {
  const { database } = await createAdminClient();

  return database.updateDocument(
    DATABASE_ID,
    TRANSACTION_COLLECTION_ID,
    transactionId,
    data
  );
}

async function deductBalance(
  userDocumentId: string,
  currentBalance: number,
  amount: number
) {
  const { database } = await createAdminClient();

  return database.updateDocument(
    DATABASE_ID,
    USER_COLLECTION_ID,
    userDocumentId,
    {
      balance: currentBalance - amount,
    }
  );
}

async function processService({
  title,
  amount,
  category,
  providerRequest,
}: {
  title: string;
  amount: number;
  category: string;
  providerRequest: () => Promise<ServiceResponse>;
}) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  const { document: user } = await getCurrentUser();

  const balance = Number(user.balance || 0);

  if (balance < amount) {
    throw new Error("Insufficient Covenant balance.");
  }

  const reference = requestId();

  const transaction = await createServiceTransaction({
    userId: String(user.userId),
    title,
    amount,
    reference,
    status: "pending",
    category,
  });

  try {
    const result = await providerRequest();

    const providerStatus =
      String(result.Status || result.status || "").toLowerCase();

    const providerReference =
      String(
        result.id ||
          result.ident ||
          result.transaction_internal_id ||
          reference
      );

    if (
      providerStatus === "successful" ||
      providerStatus === "success"
    ) {
      await deductBalance(
        String(user.$id),
        balance,
        amount
      );

      await updateTransaction(transaction.$id, {
        status: "success",
        reference: providerReference,
      });

      return {
        success: true,
        status: "success",
        reference: providerReference,
        response: result,
      };
    }

    if (providerStatus === "processing") {
      await updateTransaction(transaction.$id, {
        status: "processing",
        reference: providerReference,
      });

      return {
        success: true,
        status: "processing",
        reference: providerReference,
        response: result,
      };
    }

    await updateTransaction(transaction.$id, {
      status: "failed",
      reference: providerReference,
    });

    throw new Error(
      String(
        result.api_response ||
          result.message ||
          "Service purchase failed."
      )
    );
  } catch (error) {
    await updateTransaction(transaction.$id, {
      status: "failed",
      reference,
    });

    throw error;
  }
}

/* =========================
   AIRTIME
========================= */

export async function buyAirtime({
  network,
  phone,
  amount,
}: {
  network: string;
  phone: string;
  amount: number;
}) {
  return processService({
    title: `${network} Airtime`,
    amount,
    category: "Airtime",
    providerRequest: () =>
      vtuRequest("/topup/", {
        network,
        mobile_number: phone,
        Ported_number: "true",
        "request-id": requestId(),
        amount,
        airtime_type: "VTU",
      }),
  });
}

/* =========================
   DATA
========================= */

export async function buyData({
  network,
  phone,
  plan,
  amount,
}: {
  network: string;
  phone: string;
  plan: string;
  amount: number;
}) {
  return processService({
    title: `${network} Data`,
    amount,
    category: "Data",
    providerRequest: () =>
      vtuRequest("/data/", {
        network,
        mobile_number: phone,
        Ported_number: "true",
        "request-id": requestId(),
        plan,
      }),
  });
}

/* =========================
   ELECTRICITY
========================= */

export async function verifyElectricityMeter({
  discoName,
  meterNumber,
}: {
  discoName: string;
  meterNumber: string;
}) {
  return vtuRequest("/billpayment/verify/", {
    disco_name: discoName,
    meter_number: meterNumber,
    "request-id": requestId(),
  });
}

export async function payElectricity({
  discoName,
  meterNumber,
  meterType,
  amount,
  phone,
}: {
  discoName: string;
  meterNumber: string;
  meterType: string;
  amount: number;
  phone?: string;
}) {
  return processService({
    title: "Electricity Bill",
    amount,
    category: "Electricity",
    providerRequest: () =>
      vtuRequest("/billpayment/", {
        disco_name: discoName,
        meter_number: meterNumber,
        MeterType: meterType,
        amount,
        mobile_number: phone || "",
        "request-id": requestId(),
      }),
  });
}

/* =========================
   CABLE TV
========================= */

export async function verifyCable({
  cableName,
  smartCardNumber,
}: {
  cableName: string;
  smartCardNumber: string;
}) {
  return vtuRequest("/cablesub/verify/", {
    cablename: cableName,
    smart_card_number: smartCardNumber,
    "request-id": requestId(),
  });
}

export async function buyCable({
  cableName,
  smartCardNumber,
  cablePlan,
  amount,
}: {
  cableName: string;
  smartCardNumber: string;
  cablePlan: string;
  amount: number;
}) {
  return processService({
    title: "Cable TV Subscription",
    amount,
    category: "Cable TV",
    providerRequest: () =>
      vtuRequest("/cablesub/", {
        cablename: cableName,
        smart_card_number: smartCardNumber,
        cableplan: cablePlan,
        "request-id": requestId(),
      }),
  });
}

/* =========================
   EXAM PINS
========================= */

export async function buyExamPin({
  examName,
  quantity,
  amount,
}: {
  examName: string;
  quantity: number;
  amount: number;
}) {
  return processService({
    title: "Exam PIN",
    amount,
    category: "Education",
    providerRequest: () =>
      vtuRequest("/exam/", {
        exam_name: examName,
        quantity,
        "request-id": requestId(),
      }),
  });
}

/* =========================
   DATA PINS
========================= */

export async function buyDataPin({
  network,
  quantity,
  dataPlan,
  businessName,
  amount,
}: {
  network: string;
  quantity: number;
  dataPlan: string;
  businessName: string;
  amount: number;
}) {
  return processService({
    title: `${network} Data PIN`,
    amount,
    category: "Data PIN",
    providerRequest: () =>
      vtuRequest("/datapin/", {
        network,
        quantity,
        data_plan: dataPlan,
        businessname: businessName,
        "request-id": requestId(),
      }),
  });
}
export async function getDataPlans() {
  return vtuRequest("/listdataplans/", {});
}
export async function getCablePlans() {
  return vtuRequest("/listcabletvplans/", {});
}
export async function buyRechargeCard({
  network,
  networkAmount,
  quantity,
  nameOnCard,
}: {
  network: string;
  networkAmount: number;
  quantity: number;
  nameOnCard: string;
}) {
  const totalAmount = networkAmount * quantity;

  return processService({
    title: `${network} Recharge PIN`,
    amount: totalAmount,
    category: "Recharge Card",
    providerRequest: () =>
      vtuRequest("/rechargepin/", {
        network,
        network_amount: networkAmount,
        quantity,
        name_on_card: nameOnCard,
        "request-id": requestId(),
      }),
  });
}
export async function buyInternetBundle({
  network,
  dataPlan,
  mobileNumber,
  accountId,
  amount,
}: {
  network: string;
  dataPlan: string;
  mobileNumber: string;
  accountId?: string;
  amount: number;
}) {
  return processService({
    title: `${network} Internet Bundle`,
    amount,
    category: "Internet Bundle",
    providerRequest: () =>
      vtuRequest("/internetbundles/", {
        network,
        data_plan: dataPlan,
        mobile_number: mobileNumber,
        account_Id: accountId || "",
        Ported_number: "true",
        "request-id": requestId(),
      }),
  });
}
export async function sendBulkSms({
  sender,
  numbers,
  message,
  amount,
}: {
  sender: string;
  numbers: string;
  message: string;
  amount: number;
}) {
  return processService({
    title: "Bulk SMS",
    amount,
    category: "Bulk SMS",
    providerRequest: () =>
      vtuRequest("/bulksms/", {
        sender,
        number: numbers,
        message,
      }),
  });
}
export async function getInternetBundlePlans() {
  return vtuRequest("/listinternetbundlesplans/", {});
}