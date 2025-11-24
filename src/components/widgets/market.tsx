import Link from "next/link";
import { ExternalLink } from "lucide-react";

const Market = ({ market }: { market: any }) => {
  return (
    <Link
      href={`https://polymarket.com/event/${market.event.slug}`}
      target="_blank"
      className="flex items-center hover:underline hover:text-white/80"
    >
      <img
        width={40}
        height={40}
        src={market.market.icon}
        alt={market.market.question}
        className="rounded-full mr-2"
      />

      <div className="flex items-center gap-1 text-sm text-left mr-1">
        <p className={`line-clamp-2 min-w-0 max-w-[400px]`}>
          {market.market.question}
        </p>
        <ExternalLink className="w-4 h-4 shrink-0" />
      </div>
    </Link>
  );
};

export default Market;
