"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

const DangerZone = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8 rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertTriangle size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Danger Zone
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Actions in this section can permanently affect your account
              and cannot easily be reversed.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Delete account
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Permanently delete this account and its associated data.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmation(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={20} />
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="text-slate-400 transition hover:text-slate-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Delete this account?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action is permanent. Make sure you really want to
              continue before deleting the account.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DangerZone;