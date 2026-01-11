import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getLastClaimAt,
  getContractAddresses,
} from "./contracts";

export function exposeEval() {
  if (window.__EVAL__) return;

  window.__EVAL__ = {
    connectWallet: async () => {
      try {
        const address = await connectWallet();
        return address;
      } catch (error) {
        throw new Error(`Wallet connection failed: ${error.message}`);
      }
    },

    requestTokens: async () => {
      try {
        const txHash = await requestTokens();
        return txHash;
      } catch (error) {
        throw new Error(`Token request failed: ${error.message}`);
      }
    },

    getBalance: async (address) => {
      try {
        const balance = await getBalance(address);
        return balance.toString();
      } catch (error) {
        throw new Error(`Failed to get balance: ${error.message}`);
      }
    },

    canClaim: async (address) => {
      try {
        return await canClaim(address);
      } catch (error) {
        throw new Error(`Failed to check claim eligibility: ${error.message}`);
      }
    },

    getRemainingAllowance: async (address) => {
      try {
        const allowance = await getRemainingAllowance(address);
        return allowance.toString();
      } catch (error) {
        throw new Error(`Failed to get remaining allowance: ${error.message}`);
      }
    },

    getLastClaimAt: async (address) => {
      try {
        const timestamp = await getLastClaimAt(address);
        return timestamp.toString();
      } catch (error) {
        throw new Error(`Failed to get last claim time: ${error.message}`);
      }
    },

    getContractAddresses: async () => {
      try {
        return await getContractAddresses();
      } catch (error) {
        throw new Error(`Failed to get contract addresses: ${error.message}`);
      }
    },
  };

  console.log("window.__EVAL__ exposed with all required functions");
}
