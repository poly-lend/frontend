import Link from "next/link";
import { Button } from "../ui/button";

const heroSteps = [
  {
    title: "Lock collateral",
    description:
      "Connect your wallet and lock Polymarket YES/NO shares into PolyLend as collateral.",
  },
  {
    title: "Borrow or lend",
    description:
      "Borrowers request USDC against their positions; lenders post principal + rate offers on-chain.",
  },
  {
    title: "Repay or auction",
    description:
      "Borrowers can repay anytime. Lenders can call loans, triggering a Dutch auction to refinance or liquidate the position.",
  },
];

const HeroSection = () => {
  return (
    <section
      id="product"
      className="grid flex-1 grid-cols-1 gap-8 mb-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)]"
    >
      <div className="flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/80 bg-linear-to-r from-(--brand-yellow-15) via-transparent to-transparent px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-300">
          <span className="h-2 w-2 rounded-full bg-(--brand-yellow) shadow-[0_0_10px_var(--brand-yellow-90)]" />
          <span>Experimental on-chain protocol</span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.7rem]">
          Leverage your{" "}
          <span className="bg-linear-to-r from-(--brand-yellow) to-(--brand-yellow-soft) bg-clip-text text-transparent">
            Polymarket conviction
          </span>{" "}
          without leaving the market.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          Borrow USDC against your conditional token positions and scale the
          trades you already believe in. Peer-to-peer fixed-rate loans, no price
          oracles, Blend-inspired auctions.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/borrow">
            <Button>Borrow now</Button>
          </Link>
          <Link href="https://docs.polylend.com" target="_blank">
            <Button variant="outline">View docs</Button>
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          <span className="font-semibold text-red-400">Warning:</span> PolyLend
          is unaudited and experimental. Do not deposit funds you cannot afford
          to lose.
        </p>
      </div>

      <aside className="order-first rounded-2xl border border-slate-900 bg-linear-to-b from-slate-950/90 via-(--brand-navy) to-black p-5 shadow-[0_0_0_1px_rgba(15,23,42,1),0_24px_80px_rgba(15,23,42,0.9)] md:order-0">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-(--brand-yellow-50) bg-(--brand-yellow-10) px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-(--brand-yellow-soft)">
            No oracles
          </span>
          <span className="rounded-full border border-slate-600 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-300">
            P2P fixed-rate
          </span>
          <span className="rounded-full border border-slate-600 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-300">
            Dutch auction refinancing
          </span>
        </div>

        <h2 className="text-sm font-semibold text-slate-50">
          One flow for traders, one for lenders.
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Collateral stays on-chain, loans are over-collateralized, and rates
          are discovered by lenders competing for your demand.
        </p>

        <ol className="mt-4 space-y-3 text-[0.75rem]">
          {heroSteps.map(({ title, description }, index) => (
            <li key={title} className="flex gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-[0.7rem]">
                {index + 1}
              </div>
              <div className="space-y-0.5 text-slate-300">
                <p>
                  <span className="font-semibold text-slate-50">{title}</span>
                </p>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
};

export default HeroSection;
