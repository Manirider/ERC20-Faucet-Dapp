import { ethers } from "ethers";

// addresses from env
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

// minimal ABIs
const tokenAbi = [
  "function balanceOf(address) view returns (uint256)"
];

const faucetAbi = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)"
];

let provider;
let signer;

function getProvider() {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  return accounts[0];
}

function getTokenContract() {
  if (!TOKEN_ADDRESS) throw new Error("Token address not set");
  return new ethers.Contract(TOKEN_ADDRESS, tokenAbi, getProvider());
}


function getFaucetContract(withSigner = false) {
  if (!FAUCET_ADDRESS) throw new Error("Faucet address not set");
  const p = withSigner ? signer : getProvider();
  return new ethers.Contract(FAUCET_ADDRESS, faucetAbi, p);
}


export async function requestTokens() {
  if (!signer) throw new Error("Wallet not connected");
  const tx = await getFaucetContract(true).requestTokens();
  await tx.wait();
  return tx.hash;
}

export async function getBalance(address) {
  const balance = await getTokenContract().balanceOf(address);
  return balance.toString();
}

export async function canClaim(address) {
  return await getFaucetContract().canClaim(address);
}

export async function getRemainingAllowance(address) {
  const remaining = await getFaucetContract().remainingAllowance(address);
  return remaining.toString();
}

export async function getContractAddresses() {
  return {
    token: TOKEN_ADDRESS,
    faucet: FAUCET_ADDRESS,
  };
}
