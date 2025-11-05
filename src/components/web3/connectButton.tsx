import { Button } from "@mui/material";
import { useConnect } from "wagmi";

export function ConnectButton() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => {
    if (connector.name !== "Injected") {
      return null;
    }
    return (
      <Button
        variant="contained"
        color="primary"
        key={connector.uid}
        onClick={() => connect({ connector })}
      >
        Connect
      </Button>
    );
  });
}
