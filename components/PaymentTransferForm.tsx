"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Send,
  ShieldCheck,
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
    .regex(/^\d{10}$/, "Enter a valid 10-digit account number"),
  amount: z.string().refine(
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
          className="mx-auto w-full max-w-2xl space-y-6"
        >
          {/* Header */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
                <Send size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Send money
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Transfer money securely to a Nigerian bank account.
                </p>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-[#0F766E]">
                1
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Recipient
                </h3>

                <p className="text-xs text-slate-500">
                  Enter the recipient account details.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Account number
                  </FormLabel>

                  <FormDescription className="text-xs text-slate-500">
                    Enter the recipient&apos;s 10-digit Nigerian
                    account number.
                  </FormDescription>

                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="0123456789"
                      className="mt-2 h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none transition focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
                      onChange={(event) => {
                        field.onChange(
                          event.target.value.replace(/\D/g, ""),
                        );
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-xs text-[#0F766E]">
              <CheckCircle2 size={15} />
              <span>
                Bank and account name verification is handled before
                the transfer is submitted.
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-[#0F766E]">
                2
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Transfer details
                </h3>

                <p className="text-xs text-slate-500">
                  Choose how much you want to send.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Amount
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                          ₦
                        </span>

                        <Input
                          {...field}
                          type="number"
                          min="1"
                          step="1"
                          placeholder="0.00"
                          className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-10 text-lg font-semibold text-slate-900 shadow-none focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
                        />
                      </div>
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
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Transfer note
                      <span className="ml-1 font-normal text-slate-400">
                        (optional)
                      </span>
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="e.g. Payment for order"
                        className="min-h-[100px] resize-none rounded-xl border-slate-200 bg-slate-50 text-slate-900 shadow-none placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck size={19} className="text-[#0F766E]" />

              <p className="text-sm text-slate-500">
                Your transaction will require your 4-digit PIN.
              </p>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#0F766E] text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59]"
            >
              Review transfer
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </Form>

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={closePinModal}
              disabled={isLoading}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
              <LockKeyhole size={26} />
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                Confirm transfer
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your 4-digit transaction PIN to authorize this
                transfer.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Transfer amount
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₦
                {Number(form.getValues("amount") || 0).toLocaleString(
                  "en-NG",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Account ending in{" "}
                <span className="font-semibold text-slate-700">
                  {form.getValues("accountNumber").slice(-4)}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="transactionPin"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                    event.target.value.replace(/\D/g, ""),
                  )
                }
                placeholder="••••"
                className="h-14 rounded-xl border-slate-200 bg-slate-50 text-center text-2xl tracking-[0.7em] text-slate-900 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closePinModal}
                disabled={isLoading}
                className="h-12 flex-1 rounded-xl border-slate-200 text-slate-600"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={confirmTransfer}
                disabled={isLoading || pin.length !== 4}
                className="h-12 flex-1 rounded-xl bg-[#0F766E] font-semibold text-white hover:bg-[#115E59] disabled:opacity-50"
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
                  <>
                    Confirm
                    <Send size={17} className="ml-2" />
                  </>
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