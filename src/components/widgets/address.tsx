import { truncateAddress } from "@/utils/convertors";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Address({ address }: { address: `0x${string}` }) {
  return (
    <Link href={`https://polygonscan.com/address/${address}`} target="_blank">
      <div className="flex items-center gap-1 justify-end text-primary hover:text-primary/80 underline-offset-1=">
        {truncateAddress(address)} <ExternalLink className="w-4 h-4" />
      </div>
    </Link>
  );
}
