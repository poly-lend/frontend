import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip } from "@mui/material";
import Link from "next/link";

const Market = ({ market }: { market: any }) => {
  return (
    <Link
      href={`https://polymarket.com/event/${market.event.slug}`}
      target="_blank"
      className="flex items-start gap-1"
    >
      <img
        width={40}
        height={40}
        src={market.market.icon}
        alt={market.market.question}
        className="rounded-full"
      />

      <div className="text-sm text-left max-w-[300px] line-clamp-2">
        {market.market.question} <OpenInNewIcon sx={{ fontSize: 16 }} />
      </div>

      <Chip
        className="mt-2"
        label={market.outcome}
        size="small"
        color={market.outcome === "Yes" ? "success" : "error"}
      />
    </Link>
  );
};

export default Market;
