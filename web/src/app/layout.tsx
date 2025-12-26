import type { Metadata } from "next";
import Children from "./children";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

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
    <html lang="en" className={roboto.className}>
      <body className="min-h-screen flex flex-col">
        <Children>{children}</Children>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
