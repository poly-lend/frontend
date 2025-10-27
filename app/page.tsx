import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex pitems-center justify-center">
      <main>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            paddingTop: 100,
            textAlign: "center",
          }}
        >
          PolyLend
        </h1>
        <div style={{ padding: "50px" }}></div>
        <p className="text-lg">
          <LinkIcon />{" "}
          <Link
            style={{ color: "violet" }}
            href="https://dexscreener.com/solana/spxt3uccvjbuixzv8uwtxscxkchkzrs9hqnmyxzgfkh"
          >
            https://dexscreener.com/solana/spxt3uccvjbuixzv8uwtxscxkchkzrs9hqnmyxzgfkh
          </Link>
        </p>
        <p>
          <GitHubIcon />{" "}
          <Link
            style={{ color: "violet" }}
            href="https://github.com/poly-lend/"
          >
            https://github.com/poly-lend/
          </Link>
        </p>
        <p>
          <TelegramIcon />{" "}
          <Link style={{ color: "violet" }} href="https://t.me/poly_lend">
            @poly_lend
          </Link>
        </p>
        <p>
          <XIcon />{" "}
          <Link style={{ color: "violet" }} href="https://x.com/poly_lend">
            @poly_lend
          </Link>
        </p>
      </main>
    </div>
  );
}
