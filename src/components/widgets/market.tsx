import Link from "next/link";
import { ExternalLink } from "lucide-react";

const Market = ({ market }: { market: any }) => {
  return (
    <Link
      href={`https://polymarket.com/event/${market.event.slug}`}
      target="_blank"
      className="flex items-center"
    >
      <img
        width={40}
        height={40}
        src={market.market.icon}
        alt={market.market.question}
        className="rounded-full mr-2"
      />

      <div className="flex items-center gap-1 text-sm text-left line-clamp-2 mr-1 ">
        {market.market.question} <ExternalLink className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default Market;
