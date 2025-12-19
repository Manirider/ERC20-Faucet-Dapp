const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Token
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("FaucetToken deployed to:", tokenAddress);

  // Deploy Faucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("TokenFaucet deployed to:", faucetAddress);

  // Set faucet as minter
  const tx = await token.setFaucet(faucetAddress);
  await tx.wait();
  console.log("Faucet authorized as minter");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
