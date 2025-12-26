import BadgePill from './badgePill'
import HomeCard from './homeCard'
import SectionHeader from './sectionHeader'

const audienceCards = [
  {
    title: 'Borrow without closing your position',
    description:
      'Lock in a conviction trade on Polymarket, then post it as collateral on PolyLend to borrow USDC. Re-enter the same market or diversify into new ones.',
    badges: [
      { label: 'For traders', variant: 'brand' as const },
      { label: 'Polymarket power users', variant: 'neutral' as const },
    ],
    bullets: [
      'Request a loan with amount and minimum duration.',
      'Choose from competing lender offers at different rates.',
      'Repay early anytime to reclaim your conditional tokens.',
    ],
  },
  {
    title: 'Earn yield from prediction markets',
    description:
      'Provide USDC loans to traders seeking leverage. You choose which markets, which collateral, and what interest rate you are willing to accept.',
    badges: [
      { label: 'For lenders', variant: 'brand' as const },
      { label: 'USDC native', variant: 'neutral' as const },
    ],
    bullets: [
      'Browse open loan requests filtered by market and collateral.',
      'Post principal + rate offers, optionally with a minimum duration.',
      'Call loans after the minimum period and rely on auctions to exit or take collateral.',
    ],
  },
]

const TradersLendersSection = () => {
  return (
    <section className="border-t border-slate-900 pt-6">
      <SectionHeader title="For traders and for lenders" />

      <div className="grid gap-4 md:grid-cols-2">
        {audienceCards.map(({ title, description, bullets, badges }) => (
          <HomeCard
            key={title}
            title={title}
            body={
              <>
                <p className="mb-2 text-xs leading-relaxed text-slate-300">{description}</p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-3">
                      <span className="absolute left-0 top-1 text-[var(--brand-yellow)]">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>{' '}
              </>
            }
            preface={
              <div className="mb-3 flex flex-wrap gap-2 text-[0.68rem]">
                {badges.map(({ label, variant }) => (
                  <BadgePill key={label} variant={variant}>
                    {label}
                  </BadgePill>
                ))}
              </div>
            }
          />
        ))}
      </div>
    </section>
  )
}

export default TradersLendersSection
