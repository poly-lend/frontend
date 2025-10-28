import { createContext } from "react";

export const BalanceRefreshContext = createContext({
  balanceRefresh: false,
  setBalanceRefresh: (value: boolean) => {},
});
