import ConnectWallet from "../web3/connectWallet";

export default function ConnectWidget() {
  return (
    <div className="text-center">
      <div className="text-lg mb-5 mt-10">
        Connect your wallet to interact with the platform and see your data
      </div>
      <ConnectWallet />
    </div>
  );
}
