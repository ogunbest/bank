"use client";

import { User, Mail, Pencil } from "lucide-react";

import SettingSection from "./SettingSection";

const Profile = () => {
  return (
    <SettingSection icon={User} title="Profile">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-[#0F766E]">
            OJ
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Ogunbukola Joshua
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Mail size={14} />
              ogunbestjosh@gmail.com
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Account type
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            Personal Account
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Account status
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-slate-900">
              Active
            </span>
          </div>
        </div>
      </div>
    </SettingSection>
  );
};

export default Profile;