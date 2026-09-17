"use client";

import { useEffect, useState } from "react";
import { Bell, Lock, User } from "lucide-react";
import SettingSection from "@/components/settings/SettingSection";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import {
  updateCurrentUserPassword,
  updateCurrentUserProfile,
} from "@/lib/actions/user.actions";
import {
  getCurrentUserNotifications,
  markNotificationAsRead,
} from "@/lib/actions/notification.actions";

export default function SettingsPage() {
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
const [notifications, setNotifications] = useState<
  Array<{
    $id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    reference?: string;
    $createdAt: string;
  }>
>([]);

const [notificationsLoading, setNotificationsLoading] = useState(true);

 useEffect(() => {
  if (!data?.user) return;

  const user = data.user as {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
  };

  setFirstName(user.firstName ?? "");
  setLastName(user.lastName ?? "");
  setPhone(user.phone ?? "");
  setAddress(user.address ?? "");
  setCity(user.city ?? "");
  setState(user.state ?? "");
}, [data?.user]);

useEffect(() => {
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const result = await getCurrentUserNotifications();

      setNotifications(
        result as unknown as Array<{
          $id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          reference?: string;
          $createdAt: string;
        }>
      );
    } catch (error) {
      console.error("NOTIFICATIONS LOAD ERROR:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  loadNotifications();
}, []);

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
const handleNotificationClick = async (
  notificationId: string
) => {
  try {
    await markNotificationAsRead(notificationId);

    setNotifications((current) =>
      current.map((notification) =>
        notification.$id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  } catch (error) {
    console.error("NOTIFICATION READ ERROR:", error);
  }
};

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-4xl mx-auto py-8 px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your account and preferences.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        <SettingSection icon={User} title="Profile">
          {loading ? (
            <p className="text-gray-400">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    State
                  </label>
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {message && (
                <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
                  <p className="text-sm text-gray-300">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </SettingSection>

        <SettingSection icon={Lock} title="Security">
  <form onSubmit={handlePasswordChange} className="space-y-5">
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        Current password
      </label>

      <input
        type="password"
        value={currentPassword}
        onChange={(event) =>
          setCurrentPassword(event.target.value)
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
        placeholder="Enter current password"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-400 mb-2">
        New password
      </label>

      <input
        type="password"
        value={newPassword}
        onChange={(event) =>
          setNewPassword(event.target.value)
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
        placeholder="At least 8 characters"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-400 mb-2">
        Confirm new password
      </label>

      <input
        type="password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
        placeholder="Confirm new password"
      />
    </div>

    {passwordMessage && (
      <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
        <p className="text-sm text-gray-300">
          {passwordMessage}
        </p>
      </div>
    )}

    <button
      type="submit"
      disabled={passwordSaving}
      className="rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {passwordSaving ? "Updating..." : "Update password"}
    </button>
  </form>
</SettingSection>
       <SettingSection icon={Bell} title="Notifications">
  {notificationsLoading ? (
    <p className="text-gray-400">
      Loading notifications...
    </p>
  ) : notifications.length === 0 ? (
    <div className="rounded-lg border border-gray-700 bg-gray-900/70 p-6 text-center">
      <p className="text-gray-300">
        No notifications yet.
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Important account and transaction updates will appear here.
      </p>
    </div>
  ) : (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <button
          key={notification.$id}
          type="button"
          onClick={() =>
            handleNotificationClick(notification.$id)
          }
          className={`w-full text-left rounded-lg border p-4 transition ${
            notification.read
              ? "border-gray-700 bg-gray-900/50"
              : "border-indigo-500/40 bg-indigo-500/10"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-white">
                {notification.title}
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                {notification.message}
              </p>
            </div>

            {!notification.read && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400" />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            {new Date(notification.$createdAt).toLocaleString()}
          </p>
        </button>
      ))}
    </div>
  )}
</SettingSection>
      </main>
    </div>
  );
}