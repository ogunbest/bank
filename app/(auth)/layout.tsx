import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-[#F8FAFC] font-inter">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#0F766E]/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-teal-300/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Authentication */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center lg:w-1/2">
        {children}
      </div>

      {/* Desktop visual panel */}
      <div className="relative hidden min-h-screen w-1/2 overflow-hidden bg-[#0F766E] lg:flex lg:items-center lg:justify-center">
        {/* Teal / dark decoration */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#115E59]/40 blur-3xl" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex max-w-lg flex-col items-center px-10 text-center">
          {/* Logo */}
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <span className="text-2xl font-bold text-[#0F766E]">
              C
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Banking made simple.
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-teal-50">
            Manage your money, track your transactions, and stay in control of
            your finances from one secure place.
          </p>

          {/* Product visual */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
            <Image
              src="/icons/convenant.png"
              alt="Covenant banking"
              width={500}
              height={500}
              className="h-auto w-[360px] object-contain"
              priority
            />
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-teal-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Secure digital banking
          </div>
        </div>
      </div>
    </main>
  );
}