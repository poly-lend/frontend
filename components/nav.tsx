import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
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
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        <div>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.id}
              style={{
                marginRight: 20,
                fontWeight: 800,
                color: selected === link.id ? "violet" : "",
              }}
              onClick={() => setSelected(link.id)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Balance />
          <ConnectButton />
        </div>
      </nav>
    </>
  );
}
