'use client'

import Bottom from '@/components/bottom'
import Nav from '@/components/nav'
import { useState } from 'react'

export default function Children({ children }: { children: React.ReactNode }) {
  const [balanceRefresh, setBalanceRefresh] = useState(false)

  return (
    <>
      <Nav />
      <div className="w-full max-w-7xl mx-auto px-4 flex-1 py-8">{children}</div>
      <Bottom />
    </>
  )
}
