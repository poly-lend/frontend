import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Nav() {
  const link = { marginRight: 12 };
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
          <Link href="/" style={link}>
            Home
          </Link>
          <Link href="/lend" style={link}>
            Lend
          </Link>
          <Link href="/borrow" style={link}>
            Borrow
          </Link>
          <Link href="/points" style={link}>
            Points
          </Link>
          <Link href="/faucet" style={link}>
            Faucet
          </Link>
        </div>
        <div>
          <ConnectButton />
        </div>
      </nav>
    </>
  );
}
