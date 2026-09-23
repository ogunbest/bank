"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  LockKeyhole,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { transferMoney } from "@/lib/actions/transfer.actions";
import { verifyTransactionPin } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  accountNumber: z
    .string()
    .regex(
      /^\d{10}$/,
      "Enter a valid 10-digit account number",
    ),
  amount: z
    .string()
    .refine(
      (value) => Number(value) > 0,
      "Enter a valid amount",
    ),
  note: z.string().optional(),
});

const PaymentTransferForm = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      amount: "",
      note: "",
    },
  });

  const openPinModal = () => {
    setPin("");
    setShowPinModal(true);
  };

  const closePinModal = () => {
    if (isLoading) return;

    setPin("");
    setShowPinModal(false);
  };

  const confirmTransfer = async () => {
  if (pin.length !== 4) {
    alert("Enter your 4-digit transaction PIN.");
    return;
  }

  const data = form.getValues();

  setIsLoading(true);

  try {
    await verifyTransactionPin(pin);

    const result = await transferMoney({
      recipientAccountNumber: data.accountNumber,
      amount: Number(data.amount),
      note: data.note,
    });

    if (result.success) {
      form.reset();
      setPin("");
      setShowPinModal(false);

      alert(
        `₦${result.amount.toLocaleString(
          "en-NG",
        )} transferred successfully to ${result.recipientName}.`,
      );

      router.push("/dashboard");
      router.refresh();
    }
  } catch (error) {
    console.error("TRANSFER ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to complete transfer.",
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(openPinModal)}
          className="mx-auto flex w-full max-w-3xl flex-col gap-6"
        >
          <div className="rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-5">
            <div className="flex items-start gap-3">
              <Send
                className="mt-1 text-[#14B8A6]"
                size={22}
              />

              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Send Money
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Send money securely to a Nigerian bank account.
                </p>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#0F172A]">
                  Recipient Account Number
                </FormLabel>

                <FormDescription className="text-gray-500">
                  Enter the recipient&apos;s 10-digit account number.
                </FormDescription>

                <FormControl>
                  <Input
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="0123456789"
                    className="border-gray-200 bg-white text-[#111827] placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#0F172A]">
                  Amount
                </FormLabel>

                <FormDescription className="text-gray-500">
                  Enter the amount in Nigerian Naira.
                </FormDescription>

                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1000"
                    className="border-gray-200 bg-white text-[#111827] placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#0F172A]">
                  Transfer Note
                </FormLabel>

                <FormDescription className="text-gray-500">
                  Optional message for this transfer.
                </FormDescription>

                <FormControl>
                  <Textarea
                    placeholder="e.g. Payment for order"
                    className="min-h-[120px] border-gray-200 bg-white text-[#111827] placeholder:text-gray-400"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-12 w-full bg-[#0F172A] text-white hover:bg-[#1e293b]"
          >
            <Send size={20} className="mr-2" />
            Send Money
          </Button>
        </form>
      </Form>

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={closePinModal}
              disabled={isLoading}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14B8A6]/10">
              <LockKeyhole
                size={26}
                className="text-[#14B8A6]"
              />
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Confirm Transfer
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your 4-digit transaction PIN to authorize
                this transfer.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4 text-center">
              <p className="text-sm text-gray-500">
                Transfer amount
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                ₦
                {Number(
                  form.getValues("amount") || 0,
                ).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Account ending in{" "}
                {form
                  .getValues("accountNumber")
                  .slice(-4)}
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="transactionPin"
                className="mb-2 block text-sm font-medium text-[#0F172A]"
              >
                Transaction PIN
              </label>

              <Input
                id="transactionPin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(event) =>
                  setPin(
                    event.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  )
                }
                placeholder="••••"
                className="h-12 border-gray-200 bg-white text-center text-xl tracking-[0.6em] text-[#111827]"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closePinModal}
                disabled={isLoading}
                className="h-12 flex-1"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={confirmTransfer}
                disabled={
                  isLoading || pin.length !== 4
                }
                className="h-12 flex-1 bg-[#0F172A] text-white hover:bg-[#1e293b]"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="mr-2 animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentTransferForm;