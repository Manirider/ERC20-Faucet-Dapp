
# 🚰 ERC-20 Token Faucet DApp

A production-ready decentralized application for distributing ERC-20 tokens with intelligent rate limiting, built and deployed on the **Sepolia testnet**. This project demonstrates best practices in smart contract development, frontend integration, and Web3 user experience design.



## Overview

The **ERC-20 Token Faucet DApp** provides a seamless interface for users to claim testnet tokens. It's designed with both developers and testers in mind, implementing robust rate-limiting mechanisms to prevent abuse while ensuring fair distribution.

### Key Highlights

-**Production-Ready**: Complete with Docker containerization and health checks
- **Fully Tested**: 38+ comprehensive test cases covering all edge scenarios
- **Developer-Friendly**: Exposes `window.__EVAL__` interface for automated testing
- **Gas Optimized**: Efficient storage layout and minimal gas consumption


## Features

### 🔐 Smart Contract Features

| Feature | Description |
|---------|-------------|
| **ERC-20 Compliant** | Standard `transfer`, `approve`, and `allowance` functions |
| **Rate Limiting** | 24-hour cooldown period between claims |
| **Lifetime Cap** | Maximum 1,000 tokens per wallet address |
| **Supply Control** | Hard cap of 1,000,000 total tokens |
| **Admin Controls** | Pause/unpause functionality for emergencies |
| **Access Control** | Only authorized faucet contract can mint tokens |

### 🌐 Frontend Features

| Feature | Description |
|---------|-------------|
| **Wallet Integration** | MetaMask connection via EIP-1193 standard |
| **Real-time Updates** | Auto-refresh balance and cooldown status |
| **Gas Estimation** | Live gas cost estimates before transactions |
| **Error Handling** | User-friendly error messages and status updates |
| **Responsive Design** | Modern UI that works on all devices |
| **Evaluation API** | `window.__EVAL__` for automated testing |

## Architecture

┌─────────────────────────────────────────────────────────────────────────────┐
│                          Frontend (React + Vite)                             │
│  ┌─────────────────┐   ┌──────────────────┐   ┌─────────────────────────┐   │
│  │     App.jsx     │   │   contracts.js   │   │    window.__EVAL__      │   │
│  │  • Connect      │───│  • getBalance    │───│  • All evaluation       │   │
│  │  • Claim        │   │  • canClaim      │   │    functions exposed    │   │
│  │  • Status       │   │  • requestTokens │   │  • Automated testing    │   │
│  └─────────────────┘   └──────────────────┘   └─────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │ ethers.js v6
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Sepolia Testnet                                    │
│  ┌─────────────────────────┐         ┌─────────────────────────────────┐    │
│  │      FaucetToken        │◄────────│         TokenFaucet             │    │
│  │  • ERC-20 Standard      │  mint   │  • requestTokens()              │    │
│  │  • Faucet-only minting  │         │  • 24-hour cooldown             │    │
│  │  • 1M max supply        │         │  • 1,000 token lifetime limit   │    │
│  │  • 18 decimals          │         │  • Pauseable                    │    │
│  └─────────────────────────┘         └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘


## Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contracts** | Solidity 0.8.28, OpenZeppelin Contracts 5.x |
| **Development** | Hardhat 2.22, Ethers.js 6.x |
| **Frontend** | React 18, Vite 6.x |
| **Containerization** | Docker, Docker Compose, Nginx |
| **Testing** | Hardhat Test, Chai, Mocha |
| **Network** | Ethereum Sepolia Testnet |


## Getting Started

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v9.x or higher
- **Docker** (optional, for containerized deployment)
- **MetaMask** wallet with Sepolia ETH

### Installation3


1. **Clone the repository**

   git clone https://github.com/yourusername/erc20-faucet-dapp.git
   cd erc20-faucet-dapp


2. **Install dependencies**

   # Install backend (Hardhat) dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install && cd ..


3. **Set up environment variables**

   cp .env.example .env

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

# Frontend Configuration (Vite)
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_TOKEN_ADDRESS=0xYourDeployedTokenAddress
VITE_FAUCET_ADDRESS=0xYourDeployedFaucetAddress

# Deployment Configuration (Hardhat)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key

 ⚠️ **Security Note**: Never commit your `.env` file or expose private keys.



## Usage

### Local Development

1. **Compile smart contracts**

   
   npx hardhat compile


2. **Run tests**

   npx hardhat test

3. **Start the frontend development server**

   cd frontend
   npm run dev

   Access the application at `http://localhost:5173`

### Docker Deployment

Deploy the entire application using Docker Compose:

# Build and start containers
docker compose up --build

# Access the application
# Frontend: http://localhost:3000
# Health Check: http://localhost:3000/health


### Deploying to Sepolia

1. **Ensure you have Sepolia ETH** in your deployment wallet

2. **Deploy contracts**

   npx hardhat run scripts/deploy.js --network sepolia

3. **Verify on Etherscan** (optional)

   npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS

4. **Update `.env`** with the deployed contract addresses


## Smart Contracts

### FaucetToken

An ERC-20 compliant token with controlled minting capabilities.

| Function | Description |
|----------|-------------|
| `constructor(address _faucet)` | Initializes token with authorized faucet address |
| `setFaucet(address _faucet)` | Updates the authorized faucet (owner only) |
| `mint(address to, uint256 amount)` | Mints tokens (faucet only) |

**Constants:**
- `MAX_SUPPLY`: 1,000,000 FTK (with 18 decimals)
- `name`: "Faucet Token"
- `symbol`: "FTK"

### TokenFaucet

The distribution contract handling rate-limited token claims.

| Function | Description |
|----------|-------------|
| `requestTokens()` | Claims 100 FTK (subject to cooldown and limits) |
| `canClaim(address user)` | Checks if user can claim tokens |
| `remainingAllowance(address user)` | Returns remaining lifetime allowance |
| `setPaused(bool _paused)` | Pauses/unpauses the faucet (admin only) |
| `setToken(address tokenAddress)` | Sets the token contract (admin only, one-time) |

**Constants:**
- `FAUCET_AMOUNT`: 100 FTK per claim
- `COOLDOWN_TIME`: 24 hours (86,400 seconds)
- `MAX_CLAIM_AMOUNT`: 1,000 FTK lifetime limit


## Token Economics

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Tokens per Claim** | 100 FTK | Meaningful amount for testing |
| **Cooldown Period** | 24 hours | Prevents rapid draining |
| **Lifetime Limit** | 1,000 FTK | 10 claims per wallet |
| **Maximum Supply** | 1,000,000 FTK | Sufficient for testnet usage |
| **Decimals** | 18 | ERC-20 standard |

> 💡 **Design Philosophy**: Conservative limits prevent abuse while providing enough tokens for thorough DApp testing. Each wallet can make up to 10 lifetime claims over a minimum of 10 days.


## Testing

The project includes **38 comprehensive test cases** covering:

- ✅ Token ERC-20 compliance
- ✅ Faucet claim functionality
- ✅ Cooldown enforcement
- ✅ Lifetime limit enforcement
- ✅ Pause/unpause functionality
- ✅ Multi-user scenarios
- ✅ Event emissions
- ✅ Access control
- ✅ Edge cases and error handling

**Run the test suite:**

npx hardhat test


**Run with gas reporting:**


REPORT_GAS=true npx hardhat test



## API Reference

### window.__EVAL__ Interface

The frontend exposes a global evaluation interface for automated testing:

# javascript
// Connect wallet and return address
await window.__EVAL__.connectWallet()
// Returns: "0x..." (address string)

// Request tokens from faucet
await window.__EVAL__.requestTokens()
// Returns: "0x..." (transaction hash)

// Get token balance for address
await window.__EVAL__.getBalance(address)
// Returns: "1000000000000000000" (balance in wei)

// Check if address can claim
await window.__EVAL__.canClaim(address)
// Returns: true | false

// Get remaining lifetime allowance
await window.__EVAL__.getRemainingAllowance(address)
// Returns: "900000000000000000" (allowance in wei)

// Get last claim timestamp
await window.__EVAL__.getLastClaimAt(address)
// Returns: "1704067200" (Unix timestamp)

// Get deployed contract addresses
await window.__EVAL__.getContractAddresses()
// Returns: { token: "0x...", faucet: "0x..." }


## Security

### Security Measures Implemented

| Measure | Implementation |
|---------|----------------|
| **Access Control** | Only faucet contract can mint tokens |
| **Checks-Effects-Interactions** | State updated before external calls |
| **Input Validation** | All addresses validated before use |
| **Pauseable** | Admin can halt claims if issues are detected |
| **Reentrancy Protection** | State changes occur before minting |
| **Supply Cap** | Hard limit prevents infinite minting |

### Recommendations for Production

- [ ] Complete external security audit
- [ ] Consider timelock for admin functions
- [ ] Implement multi-sig for admin wallet
- [ ] Add rate limiting at infrastructure level
- [ ] Monitor for unusual claiming patterns


## Project Structure

erc20-faucet-dapp/
├── contracts/              # Solidity smart contracts
│   ├── Token.sol          # FaucetToken ERC-20 implementation
│   └── TokenFaucet.sol    # Token distribution faucet
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── utils/
│   │   │   ├── contracts.js   # Contract interaction utilities
│   │   │   └── eval.js        # Evaluation interface
│   │   └── App.css        # Styles
│   ├── Dockerfile         # Frontend container configuration
│   └── nginx.conf         # Nginx configuration
├── scripts/               # Deployment scripts
│   └── deploy.js          # Main deployment script
├── test/                  # Test files
│   └── TokenFaucet.test.js    # Comprehensive test suite
├── docker-compose.yml     # Docker orchestration
├── hardhat.config.js      # Hardhat configuration
├── .env.example           # Environment template
└── README.md              # This file

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity style guide for smart contracts
- Write tests for all new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR


## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Author

Manikanta Suryasai
Blockchain and Aiml Developer