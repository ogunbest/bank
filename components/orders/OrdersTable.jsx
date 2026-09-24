"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search } from "lucide-react";

const orderData = [
  {
    id: "ORD001",
    customer: "John",
    total: 235.4,
    status: "Delivered",
    date: "2023-07-01",
  },
  {
    id: "ORD002",
    customer: "Jane",
    total: 412.0,
    status: "Processing",
    date: "2023-07-02",
  },
  {
    id: "ORD003",
    customer: "Bobo",
    total: 162.5,
    status: "Shipped",
    date: "2023-07-03",
  },
  {
    id: "ORD004",
    customer: "Alice",
    total: 750.2,
    status: "Pending",
    date: "2023-07-04",
  },
  {
    id: "ORD005",
    customer: "Charlie",
    total: 95.8,
    status: "Delivered",
    date: "2023-07-05",
  },
  {
    id: "ORD006",
    customer: "Eva",
    total: 310.75,
    status: "Processing",
    date: "2023-07-06",
  },
  {
    id: "ORD007",
    customer: "David",
    total: 528.9,
    status: "Shipped",
    date: "2023-07-07",
  },
  {
    id: "ORD008",
    customer: "Grace",
    total: 189.6,
    status: "Delivered",
    date: "2023-07-08",
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-teal-50 text-[#0F766E] border-teal-100";

    case "Processing":
      return "bg-amber-50 text-amber-600 border-amber-100";

    case "Shipped":
      return "bg-sky-50 text-sky-600 border-sky-100";

    case "Pending":
      return "bg-red-50 text-red-600 border-red-100";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return orderData;
    }

    return orderData.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            Orders
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Order List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and search recent orders.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {[
                "Order ID",
                "Customer",
                "Total",
                "Status",
                "Date",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.03,
                }}
                className="transition hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                  {order.id}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {order.customer}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                  ${order.total.toFixed(2)}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {order.date}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    type="button"
                    aria-label={`View ${order.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
                  >
                    <Eye size={17} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search size={20} className="text-slate-400" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different order ID or customer name.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersTable;