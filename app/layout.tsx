import "@rainbow-me/rainbowkit/styles.css";

import type { Metadata } from "next";
import Children from "./children";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolyLend",
  description: "Lend and borrow against your Polymarket positions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Children>{children}</Children>;
}
