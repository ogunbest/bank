"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  const toggleNotification = (
    key: keyof typeof notifications,
  ) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <SettingSection icon={Bell} title="Notifications">
      <div className="space-y-1">
        <div className="flex items-center gap-3 border-b border-slate-100 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <Smartphone size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Push Notifications
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Receive important account alerts on your device.
            </p>
          </div>

          <ToggleSwitch
            label=""
            isOn={notifications.push}
            onToggle={() => toggleNotification("push")}
          />
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <Mail size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Email Notifications
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Receive account activity and security updates by email.
            </p>
          </div>

          <ToggleSwitch
            label=""
            isOn={notifications.email}
            onToggle={() => toggleNotification("email")}
          />
        </div>

        <div className="flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
            <MessageSquare size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              SMS Notifications
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Receive security and transaction alerts by SMS.
            </p>
          </div>

          <ToggleSwitch
            label=""
            isOn={notifications.sms}
            onToggle={() => toggleNotification("sms")}
          />
        </div>
      </div>
    </SettingSection>
  );
};

export default Notifications;