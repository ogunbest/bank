"use client";

import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          dateOfBirth: data.dateOfBirth!,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <section className="w-full max-w-md">
      {/* Brand */}
      <Link
        href="/"
        className="mb-10 flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F766E] shadow-sm">
          <span className="text-xl font-bold text-white">C</span>
        </div>

        <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Covenant
        </span>
      </Link>

      {/* Heading */}
      <div className="mb-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E]">
          <ShieldCheck size={22} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
          {user
            ? "Account created"
            : isSignIn
              ? "Welcome back"
              : "Create your account"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {user
            ? "Your account has been created successfully."
            : isSignIn
              ? "Sign in to access your Covenant banking dashboard."
              : "Enter your details to create your Covenant account."}
        </p>
      </div>

      {user ? (
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <p className="font-semibold text-[#0F766E]">
            Account created successfully.
          </p>

          <p className="mt-1 text-sm text-slate-600">
            You can now continue to your banking account.
          </p>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Sign up fields */}
              {type === "sign-up" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="First name"
                    />

                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Last name"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="Enter your city"
                    />

                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Enter your state"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                  />
                </>
              )}

              {/* Email */}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />

              {/* Password */}
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-[#0F766E] text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59]"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="mr-2 animate-spin"
                    />
                    Please wait...
                  </>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          {/* Switch auth */}
          <div className="mt-7 flex justify-center gap-1 text-sm">
            <p className="text-slate-500">
              {isSignIn
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-semibold text-[#0F766E] hover:text-[#115E59]"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </div>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            <span>Your information is securely protected.</span>
          </div>
        </>
      )}
    </section>
  );
};

export default AuthForm;