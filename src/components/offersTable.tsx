import { LoanOffer } from "@/types/polyLend";
import { toUSDCString } from "@/utils/convertors";
import { fetchOffers } from "@/utils/fetchOffers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import Address from "./address";

export default function OffersTable({
  address,
  title,
}: {
  address?: `0x${string}`;
  title?: string;
}) {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const publicClient = usePublicClient();
  useEffect(() => {
    if (!publicClient) return;
    fetchOffers({ publicClient, address }).then(setOffers);
  }, [publicClient, address]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold w-full text-center mt-8">
          {title ? title : "Offers"}
        </h2>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Offer ID</TableCell>
            <TableCell align="center">Request ID</TableCell>
            <TableCell align="center">Lender</TableCell>
            <TableCell align="center">Loan Amount</TableCell>
            <TableCell align="center">Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.offerId.toString()}>
              <TableCell align="center">{offer.offerId.toString()}</TableCell>
              <TableCell align="center">{offer.requestId.toString()}</TableCell>
              <TableCell align="center">
                <Address address={offer.lender} />
              </TableCell>
              <TableCell align="right">
                {toUSDCString(offer.loanAmount)} USDC
              </TableCell>
              <TableCell align="right">{offer.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
