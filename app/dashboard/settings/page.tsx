"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  LogOut,
  Lock,
  RefreshCw,
  Shield,
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

      setPasswordMessage(
        "Password updated successfully."
      );
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
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

        <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#0F172A]/10 blur-3xl" />

        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full bg-[#2DD4BF]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0F172A] shadow-sm ring-1 ring-gray-200 transition hover:bg-[#CCFBF1]"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account and security.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* PROFILE */}
        <section className="mb-6 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#0F172A]">
                Profile
              </h2>
              <p className="text-sm text-gray-500">
                Update your personal information.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw size={16} className="animate-spin" />
              Loading profile...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="flex items-center gap-2 rounded-2xl border border-[#99F6E4] bg-[#F0FDFA] p-4">
                  <Check
                    size={18}
                    className="text-[#0F766E]"
                  />

                  <p className="text-sm text-[#0F766E]">
                    {message}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#0F172A] px-5 py-3 font-medium text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </section>

        {/* SECURITY */}
        <section className="mb-6 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]">
              <Lock size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#0F172A]">
                Security
              </h2>
              <p className="text-sm text-gray-500">
                Keep your account secure.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5"
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
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  {passwordMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-xl bg-[#14B8A6] px-5 py-3 font-semibold text-[#0F172A] transition hover:bg-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordSaving
                ? "Updating..."
                : "Update password"}
            </button>
          </form>
        </section>

        {/* ACCOUNT */}
        <section className="mb-6 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]">
              <Wallet size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#0F172A]">
                Account
              </h2>

              <p className="text-sm text-gray-500">
                Manage your current account session.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Shield
                size={20}
                className="mt-0.5 text-[#0F766E]"
              />

              <div>
                <p className="font-medium text-[#0F172A]">
                  Current account
                </p>

                <p className="mt-1 text-sm text-gray-500">
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
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#14B8A6] hover:bg-[#F0FDFA] disabled:opacity-50"
          >
            <div>
              <p className="font-medium text-[#0F172A]">
                Switch account
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Sign out and sign in with another account.
              </p>
            </div>

            <RefreshCw
              size={20}
              className="text-[#0F766E]"
            />
          </button>
        </section>

        {/* LOGOUT */}
        <section className="rounded-3xl border border-red-100 bg-white/90 p-5 shadow-sm ring-1 ring-gray-200/70 backdrop-blur-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#0F172A]">
                Sign out
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Sign out of your Covenant account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={18} />

              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </section>
      </div>
    </main>
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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0F172A] outline-none transition placeholder:text-gray-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0F172A] outline-none transition placeholder:text-gray-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10"
      />
    </div>
  );
}