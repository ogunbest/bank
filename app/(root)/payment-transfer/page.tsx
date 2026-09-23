import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    redirect("/sign-in");
  }

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Send money securely to another Covenant account"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm />
      </section>
    </section>
  );
};

export default Transfer;
