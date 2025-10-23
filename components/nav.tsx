"use client";
import Link from "next/link";

export default function Nav() {
  const link = { marginRight: 12 };
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #eee" }}>
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
    </nav>
  );
}
