"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ClientOnly from "../utils/clientOnly";
import ConnectWallet from "./web3/connectWallet";
import SwitchChain from "./web3/switchChain";
import Balance from "./widgets/balance";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home", id: "home" },
    { href: "/lend", label: "Lend", id: "lend" },
    { href: "/borrow", label: "Borrow", id: "borrow" },
    { href: "/faucet", label: "Faucet", id: "faucet" },
    {
      href: "https://docs.polylend.com",
      label: "Docs",
      id: "docs",
      external: true,
    },
  ];

  return (
    <div
      className={cn(
        "sticky z-20 top-0 w-full bg-background/95 backdrop-blur",
        mobileOpen && "shadow-md"
      )}
    >
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
                      <Link
                        href="/"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === "/" && "text-primary"
                        )}
                      >
                        <div className="flex items-center gap-1.5 text-base font-bold">
                          Home
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Lender</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-background min-w-[200px]">
                      <NavigationMenuLink asChild>
                        <Link href="/lend">Markets</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/lend">Sent offers</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/lend">Loans</Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Borrower</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-background min-w-[200px]">
                      <NavigationMenuLink asChild>
                        <Link href="/borrower-positions">
                          Positions & Offers
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/borrower-loans">Loans</Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://docs.polylend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-1.5 text-base font-bold">
                          Docs
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* {links.map((link) => {
                    return (
                      <NavigationMenuItem key={link.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={
                              link.external ? "noopener noreferrer" : undefined
                            }
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathname === link.href && "text-primary"
                            )}
                          >
                            <div className="flex items-center gap-1.5 text-base font-bold">
                              {link.label}
                              {link.external && (
                                <ExternalLink className="h-4 w-4" />
                              )}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })} */}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop wallet controls */}
            <div className="hidden md:flex items-center gap-4 font-bold">
              <ClientOnly>
                <SwitchChain />
              </ClientOnly>
              <ClientOnly>
                <div className="text-right">
                  <Balance />
                </div>
              </ClientOnly>
              <ClientOnly>
                <ConnectWallet />
              </ClientOnly>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border border-b bg-background pb-4 shadow-md">
            <div className="flex flex-col pt-2">
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-2 text-base font-semibold",
                    pathname === link.href && "text-primary"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.external && <ExternalLink className="h-4 w-4" />}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 font-bold">
              <ClientOnly>
                <SwitchChain />
              </ClientOnly>
              <ClientOnly>
                <Balance />
              </ClientOnly>
              <ClientOnly>
                <ConnectWallet />
              </ClientOnly>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
