import AuthForm from "@/components/AuthForm";

const SignUp = async () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Background design */}
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

      {/* Auth content */}
      <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F172A] shadow-lg">
              <span className="text-xl font-bold text-[#2DD4BF]">C</span>
            </div>

            <h1 className="text-2xl font-bold text-[#0F172A]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Get started with Covenant today
            </p>
          </div>

          <div className="rounded-3xl bg-white/90 p-6 shadow-xl shadow-[#0F172A]/5 ring-1 ring-gray-200/70 backdrop-blur-xl sm:p-8">
            <AuthForm type="sign-up" />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure banking made simple.
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUp;