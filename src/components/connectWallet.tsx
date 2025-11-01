import { useAccount } from "wagmi";
import { ConnectButton } from "./connectButton";
import { ConnectedAccount } from "./connectedAccount";

export default function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <ConnectedAccount />;
  return <ConnectButton />;
}
