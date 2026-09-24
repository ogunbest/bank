"use client";

import { useState } from "react";
import {
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";

import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <SettingSection icon={Lock} title="Security">
      <div className="space-y-1">
        {/* TWO FACTOR */}
        <div className="flex items-center gap-3 border-b border-slate-100 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <ShieldCheck size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Two-Factor Authentication
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Add an extra layer of protection when signing in.
            </p>
          </div>

          <ToggleSwitch
            label=""
            isOn={twoFactor}
            onToggle={() => setTwoFactor((current) => !current)}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <KeyRound size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Password
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Update your account password regularly.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
          >
            Change Password
          </button>
        </div>
      </div>
    </SettingSection>
  );
};

export default Security;