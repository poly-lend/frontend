import LaunchIcon from "@mui/icons-material/Launch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "../utils/clientOnly";
import ConnectWallet from "./web3/connectWallet";
import SwitchChain from "./web3/switchChain";
import Balance from "./widgets/balance";

export default function Nav() {
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
    <nav className="sticky z-10 top-0 w-full text-[var(--text-primary)] flex justify-between items-center px-4 h-16">
      <div className="w-full max-w-7xl mx-auto flex items-center h-16 px-4 justify-between">
        <div className="flex">
          <Link href="/">
            <img src="logo.png" alt="logo" className="h-12 w-auto mr-12" />
          </Link>

          {links.map((link) => (
            <Link
              href={link.href}
              key={link.id}
              className="mr-8 mt-3 font-bold"
              style={{
                color:
                  usePathname() === link.href
                    ? "var(--brand-yellow)"
                    : "var(--text-primary)",
              }}
              target={link.external ? "_blank" : undefined}
            >
              {link.label}{" "}
              {link.external && <LaunchIcon sx={{ fontSize: 16 }} />}
            </Link>
          ))}
        </div>

        <div className="flex items-center h-16 px-4">
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
