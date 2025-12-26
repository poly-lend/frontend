import { ReactNode } from 'react'

type BadgeVariant = 'brand' | 'neutral'

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'border-[var(--brand-yellow-60)] bg-[var(--brand-yellow-10)] text-[var(--brand-yellow-soft)]',
  neutral: 'border-slate-700 text-slate-300',
}

type BadgePillProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const BadgePill = ({ children, variant = 'brand', className = '' }: BadgePillProps) => (
  <span
    className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
)

export default BadgePill
