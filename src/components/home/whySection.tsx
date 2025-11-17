import HomeCard from "./homeCard";
import SectionHeader from "./sectionHeader";

const cardItems = [
  {
    title: "Leverage your conviction",
    body: "Use existing Polymarket positions as collateral instead of selling them. Keep your upside while unlocking USDC liquidity.",
  },
  {
    title: "Oracle-free design",
    body: "PolyLend does not rely on price feeds. Risk and rates are determined entirely by lenders making offers on-chain.",
  },
  {
    title: "Perpetual-style loans",
    body: "No fixed maturity. Loans can run indefinitely until the borrower repays or a lender calls and a refinancing auction completes.",
  },
];

const WhySection = () => {
  return (
    <section className="border-t border-slate-900 pt-6">
      <SectionHeader
        title="Why PolyLend exists"
        description="For traders: more size on your best ideas. For lenders: yield from prediction markets without picking a side."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cardItems.map(({ title, body }) => (
          <HomeCard key={title} title={title} body={body} variant="subtle" />
        ))}
      </div>
    </section>
  );
};

export default WhySection;
