"use server";

import { parseStringify } from "../utils";
import { getBanks, getBank } from "./user.actions";
import { getTransactionsByBankId } from "./transaction.actions";

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    const banks = await getBanks({ userId });

    const accounts = banks.map((bank) => ({
      id: bank.accountId || bank.$id,
      availableBalance: 0,
      currentBalance: 0,
      institutionId: bank.bankCode,
      name: bank.bankName,
      officialName: bank.bankName,
      mask: bank.accountNumberMasked || "",
      type: "bank",
      subtype: "Nigerian bank account",
      appwriteItemId: bank.$id,
      shareableId: bank.shareableId,
      accountName: bank.accountName,
    }));

    const totalBanks = accounts.length;

    const totalCurrentBalance = accounts.reduce(
      (total, account) => total + account.currentBalance,
      0
    );

    return parseStringify({
      data: accounts,
      totalBanks,
      totalCurrentBalance,
    });
  } catch (error) {
    console.error("GET ACCOUNTS ERROR:", error);

    return parseStringify({
      data: [],
      totalBanks: 0,
      totalCurrentBalance: 0,
    });
  }
};

export const getAccount = async ({
  appwriteItemId,
}: getAccountProps) => {
  try {
    const bank = await getBank({
      documentId: appwriteItemId,
    });

    if (!bank) {
      throw new Error("Bank account not found");
    }

    const transferTransactionsData =
      await getTransactionsByBankId({
        bankId: bank.$id,
      });

    const transferTransactions =
    transferTransactionsData?.documents?.map(
      (transferData) => ({
        id: transferData.$id,
      $id: transferData.$id,
      name: transferData.name || "Transfer",
      paymentChannel: transferData.channel || "online",
      type:
        transferData.senderBankId === bank.$id
          ? "debit"
          : "credit",
      accountId: bank.accountId || bank.$id,
      amount: transferData.amount || 0,
      pending: false,
      category: transferData.category || "Transfer",
      date: transferData.$createdAt,
      image: "",
      $createdAt: transferData.$createdAt,
      channel: transferData.channel || "online",
      senderBankId: transferData.senderBankId || "",
      receiverBankId: transferData.receiverBankId || "",
    })
  ) || [];

    const account = {
      id: bank.accountId || bank.$id,
      availableBalance: 0,
      currentBalance: 0,
      institutionId: bank.bankCode,
      name: bank.bankName,
      officialName: bank.bankName,
      mask: bank.accountNumberMasked || "",
      type: "bank",
      subtype: "Nigerian bank account",
      appwriteItemId: bank.$id,
      shareableId: bank.shareableId,
      accountName: bank.accountName,
    };

    return parseStringify({
      data: account,
      transactions: transferTransactions,
    });
  } catch (error) {
    console.error("GET ACCOUNT ERROR:", error);
    return null;
  }
};