import { LoanOffer } from "@/types/polyLend";
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
            <TableCell>Offer ID</TableCell>
            <TableCell>Request ID</TableCell>
            <TableCell>Lender</TableCell>
            <TableCell>Loan Amount</TableCell>
            <TableCell>Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.offerId.toString()}>
              <TableCell>{offer.offerId.toString()}</TableCell>
              <TableCell>{offer.requestId.toString()}</TableCell>
              <TableCell>{offer.lender}</TableCell>
              <TableCell>{offer.loanAmount.toString()}</TableCell>
              <TableCell>{offer.rate.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
