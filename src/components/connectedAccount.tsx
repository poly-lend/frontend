import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function ConnectedAccount() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <div className="flex items-center gap-2">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div>
          {ensName
            ? `${ensName} (${truncateAddress(address)})`
            : truncateAddress(address)}
        </div>
      )}

      <Button variant="contained" color="primary" onClick={() => disconnect()}>
        <LogoutIcon />
      </Button>
    </div>
  );
}
