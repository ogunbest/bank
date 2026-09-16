"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { transferMoney } from "@/lib/actions/transfer.actions";

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
  email: z.string().email("Enter a valid recipient email"),
  amount: z
    .string()
    .refine((value) => Number(value) > 0, "Enter a valid amount"),
  note: z.string().optional(),
});

const PaymentTransferForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      amount: "",
      note: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const result = await transferMoney({
        recipientEmail: data.email,
        amount: Number(data.amount),
        note: data.note,
      });

      if (result.success) {
        form.reset();

        alert(
          `₦${result.amount.toLocaleString("en-NG")} transferred successfully.`,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="mx-auto flex w-full max-w-3xl flex-col gap-6"
      >
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <div className="flex items-start gap-3">
            <Send className="mt-1 text-indigo-300" size={22} />

            <div>
              <h2 className="text-lg font-semibold text-white">
                Send Money
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Transfer money directly to another Horizon account.
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                Recipient Email
              </FormLabel>

              <FormDescription className="text-gray-400">
                Enter the email address registered to the recipient.
              </FormDescription>

              <FormControl>
                <Input
                  placeholder="recipient@gmail.com"
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
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
              <FormLabel className="text-white">
                Amount
              </FormLabel>

              <FormDescription className="text-gray-400">
                Enter the amount in Nigerian Naira.
              </FormDescription>

              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1000"
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
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
              <FormLabel className="text-white">
                Transfer Note
              </FormLabel>

              <FormDescription className="text-gray-400">
                Optional message for this transfer.
              </FormDescription>

              <FormControl>
                <Textarea
                  placeholder="e.g. Payment for order"
                  className="min-h-[120px] border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full bg-indigo-600 text-white hover:bg-indigo-500"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} className="mr-2" />
              Transfer Funds
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;