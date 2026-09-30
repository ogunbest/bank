"use client";

import React from "react";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";

import { authFormSchema } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type FormSchema = z.infer<ReturnType<typeof authFormSchema>>;

interface CustomInputProps {
  control: Control<FormSchema>;
  name: FieldPath<FormSchema>;
  label: string;
  placeholder: string;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
}: CustomInputProps) => {
  const isPassword = name === "password";
  const isEmail = name === "email";
  const isDate = name === "dateOfBirth";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full space-y-2">
          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </FormLabel>

          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              type={
                isPassword
                  ? "password"
                  : isEmail
                    ? "email"
                    : isDate
                      ? "date"
                      : "text"
              }
              placeholder={placeholder}
              autoComplete={
                isEmail
                  ? "email"
                  : isPassword
                    ? "current-password"
                    : undefined
              }
              className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-teal-500 dark:focus:ring-teal-500/10"
            />
          </FormControl>

          <FormMessage className="text-xs font-medium text-red-500 dark:text-red-400" />
        </div>
      )}
    />
  );
};

export default CustomInput;