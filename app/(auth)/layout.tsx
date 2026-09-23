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
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-[#2DD4BF]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Auth form */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center lg:w-1/2">
        {children}
      </div>

      {/* Right-side visual */}
      <div className="relative hidden min-h-screen w-1/2 overflow-hidden bg-[#0F172A] lg:flex lg:items-center lg:justify-center">
        {/* Teal glow */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2DD4BF]/10 blur-3xl" />

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
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14B8A6] shadow-xl shadow-[#14B8A6]/20">
            <span className="text-2xl font-bold text-[#0F172A]">C</span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Banking made simple.
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
            Manage your money, track your transactions, and stay in control of
            your finances from one secure place.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
            <Image
              src="/icons/convenant.png"
              alt="Covenant banking"
              width={500}
              height={500}
              className="h-auto w-[360px] object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}