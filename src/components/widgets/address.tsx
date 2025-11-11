import { truncateAddress } from "@/utils/convertors";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "@mui/material";

export default function Address({ address }: { address: `0x${string}` }) {
  return (
    <Link href={`https://polygonscan.com/address/${address}`} target="_blank">
      <div className="flex items-center gap-1 justify-end">
        {truncateAddress(address)} <OpenInNewIcon sx={{ fontSize: 16 }} />
      </div>
    </Link>
  );
}
