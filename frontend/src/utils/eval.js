import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getLastClaimAt,   // ✅ ADD THIS
  getContractAddresses,
} from "./contracts";

export function exposeEval() {
  if (window.__EVAL__) return;

  window.__EVAL__ = {
    connectWallet,
    requestTokens,
    getBalance,
    canClaim,
    getRemainingAllowance,
    getLastClaimAt, // ✅ EXPOSE IT
    getContractAddresses,
  };

  console.log("✅ window.__EVAL__ exposed");
}
