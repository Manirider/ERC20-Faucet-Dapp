**##ERC20 Token Faucet DApp##**

A secure and rate-limited ERC20 faucet decentralized application deployed on the Sepolia Ethereum test network.
The project demonstrates end-to-end Web3 development, including smart contracts, wallet integration, and a modern frontend.

**Overview**

This application allows users to request ERC20 test tokens in a controlled and secure manner.
All limits and cooldowns are enforced at the smart-contract level, ensuring trustless operation without any backend services.

The frontend provides real-time feedback such as wallet status, balances, cooldown timers, and estimated gas costs.

**Key Features**

MetaMask wallet connection (Sepolia network)

ERC20 token faucet with on-chain rate limiting

Cooldown enforcement per wallet address

Real-time token balance and remaining allowance

Live gas fee estimation before transaction submission

Copy wallet address functionality

Clean, responsive, production-style UI

Fully decentralized (no backend server)

**Technology Stack**

Smart Contracts
Solidity
OpenZeppelin Contracts
Hardhat
Sepolia Testnet
Frontend
React (Vite)
Ethers.js
MetaMask
Custom CSS (dark UI)
Tooling & Deployment
Vercel (frontend deployment)
Etherscan (contract interaction & verification)

**Project Structure**
erc20-faucet-dapp/
├── contracts/            # ERC20 token & Faucet contracts
├── scripts/              # Deployment scripts
├── test/                 # Smart contract tests
├── frontend/
│   ├── src/
│   │   ├── utils/        # Contract & wallet utilities
│   │   ├── App.jsx
│   │   └── App.css
│   ├── index.html
│   └── .env
├── hardhat.config.js
└── README.md

**Environment Configuration**

Create a .env file inside the frontend directory:

VITE_TOKEN_ADDRESS=0xYourTokenContractAddress
VITE_FAUCET_ADDRESS=0xYourFaucetContractAddress


These values are injected at build time and used by the frontend to interact with deployed contracts.

**Running the Project Locally**
# Install root dependencies
npm install

# Start the frontend
cd frontend
npm install
npm run dev


# The application will be available at:

# http://localhost:5173


# **Application Flow:** 

User connects their MetaMask wallet

The faucet contract checks eligibility (canClaim)

Tokens are minted and transferred if allowed

Cooldown is recorded on-chain

UI updates with balance, allowance, and next claim time


 # **Security Considerations**

All minting permissions are restricted to the faucet contract

Cooldown and rate limits are enforced on-chain

No private keys are stored or handled by the frontend

No centralized backend or database is used


##  Live Demo

The ERC-20 Faucet DApp is deployed on Vercel and available for testing on the Sepolia Ethereum testnet:

👉 https://erc-20-faucet-dapp.vercel.app/

Connect your MetaMask wallet (Sepolia), request test tokens from the faucet, and observe on-chain cooldown enforcement and real-time gas cost estimation.


**Network:**
Sepolia Ethereum Testnet

# Author: -
MANIKANTA SURYASAI  - FULL STACK & AI & ML DEVELOPER

## License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software with proper attribution.

See the [LICENSE](LICENSE) file for more details.


AI/ML & Full-Stack Developer
Interests: Web3, scalable systems, decentralized applications

If you want next:
