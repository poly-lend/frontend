import useUSDCBalance from '@/hooks/useUSDCBalance'
import { toUSDCString } from '@/utils/convertors'
import { chain } from '@/utils/wagmi'
import { useContext, useEffect } from 'react'
import { useConnection } from 'wagmi'
import { BalanceRefreshContext } from '../../app/context'

export default function Balance() {
  const { address, chain: currentChain } = useConnection()
  const { balanceRefresh } = useContext(BalanceRefreshContext)

  const { balance, refresh } = useUSDCBalance(true)

  useEffect(() => {
    refresh()
  }, [balanceRefresh, refresh])

  const isPolygon = currentChain?.id === chain.id

  return address && isPolygon && <div className="mr-4 font-bold">{balance ? toUSDCString(balance) : 0}</div>
}
