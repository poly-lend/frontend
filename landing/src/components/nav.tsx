'use client'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { ExternalLink, Menu, X } from 'lucide-react'
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
            <div className="hidden md:flex items-center gap-6 flex-1">
              <NavigationMenu viewport={false}>
                <NavigationMenuList className="gap-4 items-center flex">
                  <NavigationMenuItem className="mr-2 lg:mr-6">
                    <Link href="https://polylend.com" className="flex items-center">
                      <img src="/logo.png" alt="logo" className="h-12 w-auto" />
                    </Link>
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
            <div className="ml-auto">
              <Link href="https://app.polylend.com">
                <Button>Go to App</Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop wallet controls */}
            <div className="hidden md:flex items-center gap-4 font-bold"></div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border border-b bg-background pb-4 shadow-md">
            <div className="py-2">
              <Link href="https://app.polylend.com" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Go to App</Button>
              </Link>
            </div>

            <Link
              href="https://docs.polylend.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-base font-semibold"
            >
              <span className="flex items-center gap-1.5">
                Docs
                <ExternalLink className="h-4 w-4" />
              </span>
            </Link>
            <div className="mt-4 flex flex-col gap-3 font-bold"></div>
          </div>
        )}
      </div>
    </div>
  )
}
