import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { polygon } from "wagmi/chains";

export const chain = polygon;

export const wagmiConfig = getDefaultConfig({
  appName: "PolyLend",
  projectId: "94d8a8f24aeda672e7b6dcb315a485ec",
  chains: [chain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export const queryClient = new QueryClient();
