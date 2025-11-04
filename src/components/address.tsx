import { truncateAddress } from "@/utils/convertors";
import { Link } from "@mui/material";

export default function Address({ address }: { address: `0x${string}` }) {
  return (
    <Link href={`https://polygonscan.com/address/${address}`} target="_blank">
      {truncateAddress(address)}
    </Link>
  );
}
