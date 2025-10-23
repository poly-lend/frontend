import Nav from "@/components/nav";
import Top from "@/components/top";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
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
  return (
    <html lang="en">
      <body>
        <Top />
        <Nav />
        {children}
      </body>
    </html>
  );
}
