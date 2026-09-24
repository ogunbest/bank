"use client";

import { Check, Copy as CopyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";

const Copy = ({ title }: { title: string }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!title) return;

    try {
      await navigator.clipboard.writeText(title);
      setHasCopied(true);

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (error) {
      console.error("COPY ERROR:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={copyToClipboard}
      disabled={!title}
      className="mt-3 h-10 max-w-full gap-2 rounded-xl border-slate-200 bg-white px-3 text-slate-600 shadow-sm hover:bg-slate-50"
    >
      <span className="max-w-[260px] truncate text-xs font-medium">
        {title || "No account ID"}
      </span>

      {hasCopied ? (
        <>
          <Check
            size={16}
            className="shrink-0 text-[#0F766E]"
          />
          <span className="hidden text-xs font-semibold text-[#0F766E] sm:inline">
            Copied
          </span>
        </>
      ) : (
        <CopyIcon
          size={16}
          className="shrink-0 text-slate-400"
        />
      )}
    </Button>
  );
};

export default Copy;