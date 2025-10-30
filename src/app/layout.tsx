import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import Children from "./children";
import "./globals.css";
import { theme } from "./theme";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <html lang="en">
        <body className="min-h-screen">
          <Children>{children}</Children>
        </body>
      </html>
    </ThemeProvider>
  );
}
