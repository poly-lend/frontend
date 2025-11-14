"use client";

import DexScreenerIcon from "@/components/svgs/dexscreenerIcon";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col pitems-center justify-center gap-1">
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          paddingTop: 50,
          paddingBottom: 20,
          textAlign: "center",
        }}
      >
        PolyLend
      </h1>
      <div className="flex items-center gap-1">
        <DexScreenerIcon />
        <Link
          target="_blank"
          style={{ color: "violet" }}
          href="https://dexscreener.com/solana/spxt3uccvjbuixzv8uwtxscxkchkzrs9hqnmyxzgfkh"
        >
          9i9y5uZPFZYVJE8Ym4agXjkaCqniSDT95JPfSUH5pump
        </Link>
      </div>
      <p>
        <GitHubIcon />{" "}
        <Link
          target="_blank"
          style={{ color: "violet" }}
          href="https://github.com/poly-lend/"
        >
          https://github.com/poly-lend/
        </Link>
      </p>
      <p>
        <TelegramIcon />{" "}
        <Link
          target="_blank"
          style={{ color: "violet" }}
          href="https://t.me/poly_lend"
        >
          @poly_lend
        </Link>
      </p>
      <p>
        <XIcon />{" "}
        <Link
          target="_blank"
          style={{ color: "violet" }}
          href="https://x.com/poly_lend"
        >
          @poly_lend
        </Link>
      </p>
    </div>
  );
}
