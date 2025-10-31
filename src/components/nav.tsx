import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Balance from "./balance";

export default function Nav() {
  const [selected, setSelected] = useState("home");
  const links = [
    { href: "/", label: "Home", id: "home" },
    { href: "/lend", label: "Lend", id: "lend" },
    { href: "/borrow", label: "Borrow", id: "borrow" },
    { href: "/faucet", label: "Faucet", id: "faucet" },
  ];

  return (
    <nav className="sticky top-0 w-full bg-gray-900 text-white flex justify-between items-center px-4 h-16">
      <div className="w-full max-w-7xl mx-auto flex items-center h-16 px-4 justify-between">
        <div className="flex">
          <img src="logo.png" alt="logo" className="h-12 w-auto mr-12" />

          {links.map((link) => {
            const isSelected = usePathname() === link.href;
            return (
              <Link
                href={link.href}
                key={link.id}
                className="mr-8 mt-3 font-bold"
                style={{ color: isSelected ? "#d7ad4d" : "#ededed" }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center h-16 px-4">
          <Balance />
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
