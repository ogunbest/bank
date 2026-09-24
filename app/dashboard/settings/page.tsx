"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  LogOut,
  Lock,
  RefreshCw,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  logoutAccount,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/lib/actions/user.actions";

export default function SettingsPage() {
  const router = useRouter();

  const { data, loading, error, refreshDashboard } = useDashboardData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!data?.user) return;

    const user = data.user as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
      address1?: string;
      city?: string;
      state?: string;
    };

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhone(user.phone ?? "");
    setAddress(user.address ?? user.address1 ?? "");
    setCity(user.city ?? "");
    setState(user.state ?? "");
  }, [data?.user]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setMessage("First name and last name are required.");
      return;
    }

    try {
      setSaving(true);

      await updateCurrentUserProfile({
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
      });

      await refreshDashboard();

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      await updateCurrentUserPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      console.error("PASSWORD UPDATE ERROR:", error);

      setPasswordMessage(
        error instanceof Error
          ? error.message
          : "Could not update your password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const success = await logoutAccount();

      if (success) {
        router.replace("/sign-in");
        router.refresh();
      } else {
        setLoggingOut(false);
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      setLoggingOut(true);

      const success = await logoutAccount();

      if (success) {
        router.replace("/sign-in");
        router.refresh();
      } else {
        setLoggingOut(false);
      }
    } catch (error) {
      console.error("SWITCH ACCOUNT ERROR:", error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          aria-label="Go back"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Account
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your profile, security and account session.
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Profile */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeader
          icon={<User size={20} />}
          title="Profile"
          description="Update your personal information."
        />

        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
            <RefreshCw size={16} className="animate-spin" />
            Loading profile...
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="First name"
                value={firstName}
                onChange={setFirstName}
              />

              <InputField
                label="Last name"
                value={lastName}
                onChange={setLastName}
              />
            </div>

            <InputField
              label="Phone"
              value={phone}
              onChange={setPhone}
            />

            <InputField
              label="Address"
              value={address}
              onChange={setAddress}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="City"
                value={city}
                onChange={setCity}
              />

              <InputField
                label="State"
                value={state}
                onChange={setState}
              />
            </div>

            {message && (
              <MessageBox message={message} />
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </section>

      {/* Security */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeader
          icon={<Lock size={20} />}
          title="Security"
          description="Keep your account secure."
        />

        <form
          onSubmit={handlePasswordChange}
          className="mt-6 space-y-5"
        >
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
          />

          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm new password"
          />

          {passwordMessage && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                {passwordMessage}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {passwordSaving
              ? "Updating..."
              : "Update password"}
          </button>
        </form>
      </section>

      {/* Account */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeader
          icon={<Wallet size={20} />}
          title="Account"
          description="Manage your current account session."
        />

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 text-[#0F766E]"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Current account
              </p>

              <p className="mt-1 truncate text-sm text-slate-500">
                {data?.user?.email || "Your signed-in account"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwitchAccount}
          disabled={loggingOut}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#99F6E4] hover:bg-[#F0FDFA] disabled:opacity-50"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Switch account
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Sign out and sign in with another account.
            </p>
          </div>

          <RefreshCw
            size={19}
            className="shrink-0 text-[#0F766E]"
          />
        </button>
      </section>

      {/* Logout */}
      <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Sign out
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign out of your Covenant account on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-slate-900">{title}</h2>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
      />
    </div>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50 p-4">
      <Check size={18} className="shrink-0 text-[#0F766E]" />

      <p className="text-sm text-[#0F766E]">{message}</p>
    </div>
  );
}