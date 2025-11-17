import HomeCard from "./homeCard";
import SectionHeader from "./sectionHeader";

const steps = [
  {
    title: "1. Loan initiation",
    body: "A borrower locks conditional tokens as collateral and creates a loan request. Lenders post offers specifying principal, interest rate, and optional minimum duration. When the borrower accepts an offer, the loan becomes active and USDC is transferred.",
  },
  {
    title: "2. Repayment and auctions",
    body: "Interest accrues continuously. Borrowers can repay at any time, reclaiming their collateral. After the minimum duration, the lender may call the loan, triggering a Dutch auction in interest-rate space to find a new lender or result in liquidation.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="border-t border-slate-900 pt-6">
      <SectionHeader
        title="How the protocol works"
        description="High level overview of the core state machine: request → active loan → auction → repaid or liquidated."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(({ title, body }) => (
          <HomeCard key={title} title={title} body={body} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
