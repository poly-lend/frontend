import "@fontsource/roboto/700.css";
import type { Metadata } from "next";
import Children from "./children";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolyLend",
  description: "Lend and borrow against your Polymarket positions",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Children>{children}</Children>
      </body>
    </html>
  );
}
