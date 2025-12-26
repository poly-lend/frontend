'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn('sticky z-20 top-0 w-full bg-background/95 backdrop-blur', mobileOpen && 'shadow-md')}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center md:hidden">
              <img src="/logo.png" alt="logo" className="h-10 w-auto" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:block">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-4 items-center flex">
                  <NavigationMenuItem className="mr-2 lg:mr-6">
                    <Link href="/" className="flex items-center">
                      <img src="/logo.png" alt="logo" className="h-12 w-auto" />
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="https://app.polylend.com/borrow">
                        <div className="flex items-center gap-1.5 text-base font-bold">Borrow</div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="https://docs.polylend.com" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center gap-1.5 text-base font-bold">
                          Docs
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border border-b bg-background pb-4 shadow-md">
            <div className="flex flex-col pt-2">
              <Link
                href="https://app.polylend.com/borrow"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between py-2 text-base font-semibold',
                  pathname === '/borrow' && 'text-primary',
                )}
              >
                <span className="flex items-center gap-1.5">Positions & Offers</span>
              </Link>
            </div>
            <Link
              href="/borrower-loans"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center justify-between py-2 text-base font-semibold',
                pathname === '/borrower-loans' && 'text-primary',
              )}
            >
              <span className="flex items-center gap-1.5">Loans</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
