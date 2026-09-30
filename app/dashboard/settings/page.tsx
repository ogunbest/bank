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
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  logoutAccount,
  setTransactionPin as saveTransactionPin,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/lib/actions/user.actions";

export default function SettingsPage() {
  const router = useRouter();

  const { data, loading, error, refreshDashboard } =
    useDashboardData();

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

  const [transactionPin, setTransactionPin] = useState("");
  const [confirmTransactionPin, setConfirmTransactionPin] =
    useState("");

  const [pinSaving, setPinSaving] = useState(false);
  const [pinMessage, setPinMessage] = useState("");
  const [transactionPinActive, setTransactionPinActive] =
    useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const [theme, setTheme] = useState<
    "light" | "dark" | "system"
  >("system");

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
      transactionPinSet?: boolean;
    };

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setPhone(user.phone ?? "");
    setAddress(user.address ?? user.address1 ?? "");
    setCity(user.city ?? "");
    setState(user.state ?? "");

    if (typeof user.transactionPinSet === "boolean") {
      setTransactionPinActive(user.transactionPinSet);
    }
  }, [data?.user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("covenant-theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    const selectedTheme = savedTheme ?? "system";

    setTheme(selectedTheme);

    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.classList.toggle("dark", prefersDark);
    }
  }, []);

  const handleThemeChange = (
    value: "light" | "dark" | "system"
  ) => {
    setTheme(value);
    localStorage.setItem("covenant-theme", value);

    const root = document.documentElement;

    if (value === "dark") {
      root.classList.add("dark");
      return;
    }

    if (value === "light") {
      root.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    root.classList.toggle("dark", prefersDark);
  };

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

  const handleTransactionPinChange = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    setPinMessage("");

    if (!transactionPin || !confirmTransactionPin) {
      setPinMessage(
        "Please enter and confirm your transaction PIN."
      );
      return;
    }

    if (!/^\d{4}$/.test(transactionPin)) {
      setPinMessage(
        "Transaction PIN must be exactly 4 digits."
      );
      return;
    }

    if (transactionPin !== confirmTransactionPin) {
      setPinMessage("Transaction PINs do not match.");
      return;
    }

    try {
      setPinSaving(true);

      const result = await saveTransactionPin(transactionPin);

      if (!result?.success) {
        throw new Error(
          "Transaction PIN could not be saved."
        );
      }

      setTransactionPin("");
      setConfirmTransactionPin("");

      await refreshDashboard();

      setTransactionPinActive(true);
      setPinMessage("Transaction PIN is now active.");
    } catch (error) {
      console.error("TRANSACTION PIN ERROR:", error);

      setPinMessage(
        error instanceof Error
          ? error.message
          : "Could not update your transaction PIN."
      );
    } finally {
      setPinSaving(false);
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
    <div className="mx-auto w-full max-w-4xl space-y-6 text-slate-900 transition-colors dark:text-white">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-[#0F766E] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-400"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <p className="text-sm font-medium text-[#0F766E] dark:text-teal-400">
            Account
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your profile, security and account session.
          </p>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Profile */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <SectionHeader
          icon={<User size={20} />}
          title="Profile"
          description="Update your personal information."
        />

        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-500 dark:text-slate-400">
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

            {message && <MessageBox message={message} />}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </section>

      {/* Security */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <SectionHeader
          icon={<Lock size={20} />}
          title="Security"
          description="Keep your account secure."
        />

        {/* Password */}
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
            <MessageBox message={passwordMessage} />
          )}

          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            {passwordSaving
              ? "Updating..."
              : "Update password"}
          </button>
        </form>

        <div className="my-7 border-t border-slate-100 dark:border-slate-800" />

        {/* Transaction PIN status */}
        <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Transaction PIN status
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Used to authorize transfers and service payments.
            </p>
          </div>

          {transactionPinActive ? (
            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Active
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              Not set
            </span>
          )}
        </div>

        {/* Transaction PIN */}
        <form
          onSubmit={handleTransactionPinChange}
          className="space-y-5"
        >
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Transaction PIN
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Set the 4-digit PIN you will use to authorize
              payments and service purchases.
            </p>
          </div>

          <PasswordField
            label="Transaction PIN"
            value={transactionPin}
            onChange={(value) =>
              setTransactionPin(
                value.replace(/\D/g, "").slice(0, 4)
              )
            }
            placeholder="4-digit PIN"
          />

          <PasswordField
            label="Confirm transaction PIN"
            value={confirmTransactionPin}
            onChange={(value) =>
              setConfirmTransactionPin(
                value.replace(/\D/g, "").slice(0, 4)
              )
            }
            placeholder="Confirm 4-digit PIN"
          />

          {pinMessage && <MessageBox message={pinMessage} />}

          <button
            type="submit"
            disabled={pinSaving}
            className="rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            {pinSaving
              ? "Updating..."
              : transactionPinActive
              ? "Update transaction PIN"
              : "Set transaction PIN"}
          </button>
        </form>
      </section>

      {/* Appearance */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <SectionHeader
          icon={<Sun size={20} />}
          title="Appearance"
          description="Choose how Covenant looks on your device."
        />

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Theme
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                value: "light" as const,
                label: "Light",
                description: "Always use light mode",
              },
              {
                value: "dark" as const,
                label: "Dark",
                description: "Always use dark mode",
              },
              {
                value: "system" as const,
                label: "System",
                description: "Follow your device",
              },
            ].map((option) => {
              const active = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleThemeChange(option.value)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[#0F766E] bg-teal-50 ring-2 ring-[#0F766E]/10 dark:border-teal-500 dark:bg-teal-950/40"
                      : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {option.label}
                    </span>

                    {active && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-white dark:bg-teal-500">
                        <Check size={13} />
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <SectionHeader
          icon={<Wallet size={20} />}
          title="Account"
          description="Manage your current account session."
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#0F766E] dark:text-teal-400"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Current account
              </p>

              <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                {data?.user?.email ||
                  "Your signed-in account"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwitchAccount}
          disabled={loggingOut}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-200 hover:bg-teal-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-800 dark:hover:bg-teal-950/40"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Switch account
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign out and sign in with another account.
            </p>
          </div>

          <RefreshCw
            size={19}
            className="shrink-0 text-[#0F766E] dark:text-teal-400"
          />
        </button>
      </section>

      {/* Logout */}
      <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm transition-colors dark:border-red-950/50 dark:bg-slate-900 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sign out
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sign out of your Covenant account on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
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
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E] dark:bg-teal-950/50 dark:text-teal-400">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
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
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
      />
    </label>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
      {message}
    </div>
  );
}