import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "../utils/clientOnly";
import ConnectWallet from "./web3/connectWallet";
import SwitchChain from "./web3/switchChain";
import Balance from "./widgets/balance";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Nav() {
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
    <nav className="sticky z-10 top-0 w-full bg-background">
      <div className="w-full max-w-7xl mx-auto flex items-center h-16 px-4 justify-between">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-10 items-center flex">
            <NavigationMenuItem>
              <Link href="/" className="flex items-center">
                <img src="logo.png" alt="logo" className="h-12 w-auto" />
              </Link>
            </NavigationMenuItem>
            <div className="flex items-center gap-4">
              {links.map((link) => {
                return (
                  <NavigationMenuItem key={link.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === link.href && "text-primary"
                        )}
                      >
                        <div className="flex items-center gap-1.5 text-base">
                          {link.label}
                          {link.external && (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </div>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
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
    </nav>
  );
}
