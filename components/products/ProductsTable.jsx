"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Package, Search, Trash2 } from "lucide-react";

const PRODUCT_DATA = [
  {
    id: 1,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 59.99,
    stock: 143,
    sales: 1200,
  },
  {
    id: 2,
    name: "Leather Wallet",
    category: "Accessories",
    price: 39.99,
    stock: 89,
    sales: 800,
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    stock: 56,
    sales: 650,
  },
  {
    id: 4,
    name: "Yoga Mat",
    category: "Fitness",
    price: 29.99,
    stock: 210,
    sales: 950,
  },
  {
    id: 5,
    name: "Coffee Maker",
    category: "Home",
    price: 79.99,
    stock: 78,
    sales: 720,
  },
];

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return PRODUCT_DATA;
    }

    return PRODUCT_DATA.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            Inventory
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Product List
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage products, stock levels, and sales.
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-2 focus:ring-[#0F766E]/10"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[850px] w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Sales",
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
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.03,
                }}
                className="transition hover:bg-slate-50/70"
              >
                {/* PRODUCT */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-teal-50 text-[#0F766E]">
                      <Package size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Product #{product.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {product.category}
                  </span>
                </td>

                {/* PRICE */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                  ₦{product.price.toLocaleString()}
                </td>

                {/* STOCK */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      product.stock < 60
                        ? "text-red-500"
                        : product.stock < 100
                          ? "text-amber-600"
                          : "text-[#0F766E]"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* SALES */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                  {product.sales.toLocaleString()}
                </td>

                {/* ACTIONS */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-teal-100 hover:bg-teal-50 hover:text-[#0F766E]"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search size={20} className="text-slate-400" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with another product name or category.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsTable;