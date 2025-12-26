import { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  description?: ReactNode
  className?: string
}

const SectionHeader = ({ title, description, className = '' }: SectionHeaderProps) => (
  <div className={`mb-4 flex flex-wrap items-baseline gap-3 ${description ? 'justify-between' : ''} ${className}`}>
    <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
    {description ? <div className="max-w-md text-xs leading-relaxed text-slate-300">{description}</div> : null}
  </div>
)

export default SectionHeader
