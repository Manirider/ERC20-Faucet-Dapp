import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
} from "./contracts";

export function exposeEval() {
  if (window.__EVAL__) return; // prevent double init

  window.__EVAL__ = {
    connectWallet,
    requestTokens,
    getBalance,
    canClaim,
    getRemainingAllowance,
    getContractAddresses,
  };

  console.log("✅ window.__EVAL__ exposed");
}
