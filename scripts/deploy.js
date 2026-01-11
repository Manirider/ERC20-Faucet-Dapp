const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Faucet first (with empty token address)
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(ethers.ZeroAddress);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("TokenFaucet deployed to:", faucetAddress);

  // Deploy Token with faucet address
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy(faucetAddress);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("FaucetToken deployed to:", tokenAddress);

  // Set token in faucet
  const tx = await faucet.setToken(tokenAddress);
  await tx.wait();
  console.log("Token configured in Faucet");

  console.log("\n--- Deployment Summary ---");
  console.log("Token:", tokenAddress);
  console.log("Faucet:", faucetAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
