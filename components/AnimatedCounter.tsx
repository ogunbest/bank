"use client";

import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full text-slate-900 dark:text-white">
      <CountUp
        decimals={2}
        decimal="."
        separator=","
        prefix="₦"
        end={amount}
      />
    </div>
  );
};

export default AnimatedCounter;