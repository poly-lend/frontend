import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function OffersTable() {
  const { address } = useAccount();

  return address ? (
    <div>
      <div>
        <h1>OffersTable</h1>
      </div>
    </div>
  ) : (
    <div>
      <div>Connect your wallet to see your offers</div>
      <ConnectButton showBalance={false} />
    </div>
  );
}
