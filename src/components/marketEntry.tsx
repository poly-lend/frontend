import { Chip } from "@mui/material";
import Link from "next/link";

const MarketEntry = ({ market }: { market: any }) => {
  return (
    <Link
      href={`https://polymarket.com/event/${market.event.slug}`}
      className="flex items-start gap-2"
      target="_blank"
    >
      <img
        width={40}
        height={40}
        src={market.market.icon}
        alt={market.market.question}
        className="rounded-full"
      />
      <p className="text-sm text-left max-w-[300px] line-clamp-2">
        {market.market.question}
      </p>
      <Chip
        className="mt-2"
        label={market.outcome}
        size="small"
        color={market.outcome === "Yes" ? "success" : "error"}
      />
    </Link>
  );
};

export default MarketEntry;
