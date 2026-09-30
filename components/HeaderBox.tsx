import React from "react";

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-[#0F766E] dark:text-teal-400">
        Covenant Banking
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}

        {type === "greeting" && user && (
          <span className="text-[#0F766E] dark:text-teal-400">
            {" "}
            {user}
          </span>
        )}
      </h1>

      {subtext && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default HeaderBox;