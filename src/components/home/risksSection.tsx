import HomeCard from "./homeCard";
import SectionHeader from "./sectionHeader";

const riskItems = [
  {
    title: "Market & liquidation risk",
    body: "If the market moves against the borrower, the collateral may be worth less than the outstanding debt. If an auction fails to refinance the position, the lender may receive the collateral at a loss or the borrower may be effectively liquidated.",
    extra: (
      <div className="mt-3 rounded-lg border border-red-400/50 bg-red-900/20 p-3 text-[0.7rem] text-slate-100">
        <span className="font-semibold text-red-200">Important:</span>{" "}
        Over-collateralization is not a guarantee against loss. Extreme market
        moves and failed auctions can still produce bad outcomes.
      </div>
    ),
  },
  {
    title: "Protocol & integration risk",
    body: "PolyLend is an unaudited smart contract system that integrates with Polymarket’s conditional tokens. Bugs, integrations, or unexpected edge cases can result in loss of funds for both traders and lenders.",
    extra: (
      <div className="mt-3 rounded-lg border border-red-400/50 bg-red-900/20 p-3 text-[0.7rem] text-slate-100">
        <span className="font-semibold text-red-200">Do not</span> use PolyLend
        with funds you cannot afford to lose. Treat it as an experiment, not a
        savings product.
      </div>
    ),
  },
];

const RisksSection = () => {
  return (
    <section id="risk" className="border-t border-slate-900 pt-6">
      <SectionHeader title="Risks you should understand" />

      <div className="grid gap-4 md:grid-cols-2">
        {riskItems.map(({ title, body, extra }) => (
          <HomeCard key={title} title={title} body={body}>
            {extra}
          </HomeCard>
        ))}
      </div>
    </section>
  );
};

export default RisksSection;
