import { Event } from "@/types/polyLend";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const EventWidget = ({ event }: { event: Event }) => {
  return (
    <Link
      href={`https://polymarket.com/event/${event.slug}`}
      target="_blank"
      className="flex items-center hover:underline hover:text-white/80"
    >
      <img
        width={40}
        height={40}
        src={event.icon}
        alt={event.title}
        className="rounded-full mr-2"
      />

      <div className="flex items-center gap-1 text-sm text-left mr-1">
        <p className={`line-clamp-2 min-w-0 max-w-[400px]`}>{event.title}</p>
        <ExternalLink className="w-4 h-4 shrink-0" />
      </div>
    </Link>
  );
};

export default EventWidget;
