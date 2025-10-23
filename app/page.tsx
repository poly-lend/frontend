"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";

export default function Home() {
  return (
    <div className="flex pitems-center justify-center">
      <main>
        <div style={{ padding: "100px" }}></div>
        <h1 className="text-4xl font-bold">
          This is the place where PolyLend will live
        </h1>
        <div style={{ padding: "50px" }}></div>
        <p className="text-lg">
          <LinkIcon />{" "}
          <a href="https://dexscreener.com/solana/9i9y5uZPFZYVJE8Ym4agXjkaCqniSDT95JPfSUH5pump">
            9i9y5uZPFZYVJE8Ym4agXjkaCqniSDT95JPfSUH5pump
          </a>
        </p>
        <p>
          <GitHubIcon />
          <a className="text-blue-500" href="https://github.com/poly-lend/">
            https://github.com/poly-lend/
          </a>
        </p>
        <p>
          <TelegramIcon />
          <a className="text-blue-500" href="https://t.me/poly_lend">
            @poly_lend
          </a>
        </p>
        <p>
          <XIcon />
          <a className="text-blue-500" href="https://x.com/poly_lend">
            @poly_lend
          </a>
        </p>
      </main>
    </div>
  );
}
