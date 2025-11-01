import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";

export default function Bottom() {
  return (
    <footer className="border-t py-4 text-center text-sm w-full flex max-w-7xl mx-auto">
      <div className="flex-1"></div>
      <div className="flex items-center justify-center gap-4 mr-4">
        <Link
          target="_blank"
          href="https://dexscreener.com/solana/spxt3uccvjbuixzv8uwtxscxkchkzrs9hqnmyxzgfkh"
        >
          <LinkIcon />
        </Link>
        <Link target="_blank" href="https://github.com/poly-lend/">
          <GitHubIcon />
        </Link>
        <Link target="_blank" href="https://t.me/poly_lend">
          <TelegramIcon />
        </Link>

        <Link target="_blank" href="https://x.com/poly_lend">
          <XIcon />
        </Link>
      </div>
    </footer>
  );
}
