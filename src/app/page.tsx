"use client";

import { Button } from "@mui/material";

export default function Home() {
  return (
    <div className="flex flex-col pitems-center justify-center gap-1">
      {/* Hero */}
      <section
        id="product"
        className="grid flex-1 grid-cols-1 gap-8 py-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2.4fr)]"
      >
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/80 bg-gradient-to-r from-[#d7ad4d]/15 via-transparent to-transparent px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-[#d7ad4d] shadow-[0_0_10px_rgba(215,173,77,0.9)]" />
            <span>Experimental on-chain protocol</span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.7rem]">
            Leverage your{" "}
            <span className="bg-gradient-to-r from-[#d7ad4d] to-[#f5e3b0] bg-clip-text text-transparent">
              Polymarket conviction
            </span>{" "}
            without leaving the market.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Borrow USDC against your conditional token positions and scale the
            trades you already believe in. Peer-to-peer fixed-rate loans, no
            price oracles, Blend-inspired auctions.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="contained" color="primary" href="/borrow">
              Borrow now
            </Button>
            <Button
              href="https://docs.polylend.com"
              variant="outlined"
              color="primary"
              target="_blank"
            >
              View docs
            </Button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            <span className="font-semibold text-red-400">Warning:</span>{" "}
            PolyLend is unaudited and experimental. Do not deposit funds you
            cannot afford to lose.
          </p>
        </div>

        {/* Hero side card */}
        <aside className="order-first rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-950/90 via-[#091926] to-black p-5 shadow-[0_0_0_1px_rgba(15,23,42,1),0_24px_80px_rgba(15,23,42,0.9)] md:order-none">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#d7ad4d]/50 bg-[#d7ad4d]/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f5e3b0]">
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
            <li className="flex gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-[0.7rem]">
                1
              </div>
              <div className="space-y-0.5 text-slate-300">
                <p>
                  <span className="font-semibold text-slate-50">
                    Lock collateral
                  </span>
                </p>
                <p>
                  Connect your wallet and lock Polymarket YES/NO shares into
                  PolyLend as collateral.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-[0.7rem]">
                2
              </div>
              <div className="space-y-0.5 text-slate-300">
                <p>
                  <span className="font-semibold text-slate-50">
                    Borrow or lend
                  </span>
                </p>
                <p>
                  Borrowers request USDC against their positions; lenders post
                  principal + rate offers on-chain.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-950 text-[0.7rem]">
                3
              </div>
              <div className="space-y-0.5 text-slate-300">
                <p>
                  <span className="font-semibold text-slate-50">
                    Repay or auction
                  </span>
                </p>
                <p>
                  Borrowers can repay anytime. Lenders can call loans,
                  triggering a Dutch auction to refinance or liquidate the
                  position.
                </p>
              </div>
            </li>
          </ol>
        </aside>
      </section>

      <main className="space-y-10">
        {/* Why PolyLend */}
        <section className="border-t border-slate-900 pt-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-50">
              Why PolyLend exists
            </h2>
            <p className="max-w-md text-xs text-slate-300">
              For traders: more size on your best ideas. For lenders: yield from
              prediction markets without picking a side.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Leverage your conviction
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Use existing Polymarket positions as collateral instead of
                selling them. Keep your upside while unlocking USDC liquidity.
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Oracle-free design
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                PolyLend does not rely on price feeds. Risk and rates are
                determined entirely by lenders making offers on-chain.
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Perpetual-style loans
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                No fixed maturity. Loans can run indefinitely until the borrower
                repays or a lender calls and a refinancing auction completes.
              </p>
            </article>
          </div>
        </section>

        {/* Traders vs Lenders */}
        <section className="border-t border-slate-900 pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-50">
              For traders and for lenders
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Traders */}
            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <div className="mb-3 flex flex-wrap gap-2 text-[0.68rem]">
                <span className="rounded-full border border-[#d7ad4d]/60 bg-[#d7ad4d]/10 px-2 py-0.5 font-medium uppercase tracking-[0.16em] text-[#f5e3b0]">
                  For traders
                </span>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 font-medium uppercase tracking-[0.16em] text-slate-300">
                  Polymarket power users
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Borrow without closing your position
              </h3>
              <p className="mb-2 text-xs leading-relaxed text-slate-300">
                Lock in a conviction trade on Polymarket, then post it as
                collateral on PolyLend to borrow USDC. Re-enter the same market
                or diversify into new ones.
              </p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Request a loan with amount and minimum duration.
                </li>
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Choose from competing lender offers at different rates.
                </li>
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Repay early anytime to reclaim your conditional tokens.
                </li>
              </ul>
            </article>

            {/* Lenders */}
            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <div className="mb-3 flex flex-wrap gap-2 text-[0.68rem]">
                <span className="rounded-full border border-[#d7ad4d]/60 bg-[#d7ad4d]/10 px-2 py-0.5 font-medium uppercase tracking-[0.16em] text-[#f5e3b0]">
                  For lenders
                </span>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 font-medium uppercase tracking-[0.16em] text-slate-300">
                  USDC native
                </span>
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Earn yield from prediction markets
              </h3>
              <p className="mb-2 text-xs leading-relaxed text-slate-300">
                Provide USDC loans to traders seeking leverage. You choose which
                markets, which collateral, and what interest rate you are
                willing to accept.
              </p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Browse open loan requests filtered by market and collateral.
                </li>
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Post principal + rate offers, optionally with a minimum
                  duration.
                </li>
                <li className="relative pl-3">
                  <span className="absolute left-0 top-1 text-[#d7ad4d]">
                    •
                  </span>
                  Call loans after the minimum period and rely on auctions to
                  exit or take collateral.
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-slate-900 pt-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-50">
              How the protocol works
            </h2>
            <p className="max-w-md text-xs text-slate-300">
              High level overview of the core state machine: request → active
              loan → auction → repaid or liquidated.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                1. Loan initiation
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                A borrower locks conditional tokens as collateral and creates a
                loan request. Lenders post offers specifying principal, interest
                rate, and optional minimum duration. When the borrower accepts
                an offer, the loan becomes active and USDC is transferred.
              </p>
            </article>

            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                2. Repayment and auctions
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Interest accrues continuously. Borrowers can repay at any time,
                reclaiming their collateral. After the minimum duration, the
                lender may call the loan, triggering a Dutch auction in
                interest-rate space to find a new lender or result in
                liquidation.
              </p>
            </article>
          </div>
        </section>

        {/* Risks */}
        <section id="risk" className="border-t border-slate-900 pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-50">
              Risks you should understand
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Market &amp; liquidation risk
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                If the market moves against the borrower, the collateral may be
                worth less than the outstanding debt. If an auction fails to
                refinance the position, the lender may receive the collateral at
                a loss or the borrower may be effectively liquidated.
              </p>
              <div className="mt-3 rounded-lg border border-red-400/50 bg-red-900/20 p-3 text-[0.7rem] text-slate-100">
                <span className="font-semibold text-red-200">Important:</span>{" "}
                Over-collateralization is not a guarantee against loss. Extreme
                market moves and failed auctions can still produce bad outcomes.
              </div>
            </article>

            <article className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Protocol &amp; integration risk
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                PolyLend is an unaudited smart contract system that integrates
                with Polymarket’s conditional tokens. Bugs, integrations, or
                unexpected edge cases can result in loss of funds for both
                traders and lenders.
              </p>
              <div className="mt-3 rounded-lg border border-red-400/50 bg-red-900/20 p-3 text-[0.7rem] text-slate-100">
                <span className="font-semibold text-red-200">Do not</span> use
                PolyLend with funds you cannot afford to lose. Treat it as an
                experiment, not a savings product.
              </div>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-slate-900 pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-50">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-900 bg-slate-950/85 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Is PolyLend custodial?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Collateral and loans are managed by smart contracts. There is no
                traditional custodian, but the code is unaudited and may contain
                bugs. Always verify contract addresses and understand the
                trade-offs before interacting.
              </p>
            </article>

            <article className="rounded-xl border border-slate-900 bg-slate-950/85 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                What happens if no one refinances my loan?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                If a lender calls a loan and the refinancing auction fails, the
                loan can be closed by transferring collateral to the lender. The
                borrower loses their position and may still realize a loss
                relative to the debt they owed.
              </p>
            </article>

            <article className="rounded-xl border border-slate-900 bg-slate-950/85 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Which markets and chains are supported?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                PolyLend is designed for Polymarket conditional tokens on the
                same chain where those markets are deployed. Check the docs and
                UI for the current supported network and collateral types before
                interacting.
              </p>
            </article>

            <article className="rounded-xl border border-slate-900 bg-slate-950/85 p-4 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-50">
                Who is PolyLend for (and who is it not for)?
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                PolyLend is for advanced users who understand prediction
                markets, on-chain lending, and smart contract risk. It is not
                suitable for users seeking guaranteed returns or a simple
                savings product.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
