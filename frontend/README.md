# Token Faucet Frontend

React frontend for the ERC-20 Token Faucet DApp. Connects to MetaMask and allows users to claim testnet tokens from the faucet smart contract.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Opens at `http://localhost:5173`

## Environment Variables

Create a `.env` file in this directory:

```env
VITE_RPC_URL=https://sepolia.infura.io/v3/your-key
VITE_TOKEN_ADDRESS=0x...
VITE_FAUCET_ADDRESS=0x...
```

These get injected at build time by Vite.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── App.jsx           # Main component - wallet connection, claiming
├── App.css           # Styles
├── main.jsx          # React entry point
└── utils/
    ├── contracts.js  # Contract interaction functions
    └── eval.js       # window.__EVAL__ testing interface
```

## How It Works

### Wallet Connection

Uses the standard `window.ethereum` provider (MetaMask). When the user clicks "Connect Wallet":

1. Requests account access via `eth_requestAccounts`
2. Creates an ethers.js BrowserProvider and signer
3. Fetches the user's FTK balance and claim eligibility

### Claiming Tokens

When the user clicks "Claim 100 FTK":

1. Calls `requestTokens()` on the faucet contract
2. Waits for transaction confirmation
3. Refreshes balance and cooldown status

### Cooldown Timer

If the user has claimed recently, a countdown timer shows time remaining until the next claim. Updates every second.

## Contract Interaction

The `contracts.js` file exports these functions:

```javascript
// Connect wallet, returns address
connectWallet()

// Claim tokens, returns tx hash
requestTokens()

// Get FTK balance (in wei)
getBalance(address)

// Check if user can claim right now
canClaim(address)

// Get remaining lifetime allowance (in wei)
getRemainingAllowance(address)
```

## Testing Interface

For automated testing and evaluation, the app exposes `window.__EVAL__` in the browser console:

```javascript
await window.__EVAL__.connectWallet()
await window.__EVAL__.requestTokens()
await window.__EVAL__.getBalance("0x...")
await window.__EVAL__.canClaim("0x...")
await window.__EVAL__.getRemainingAllowance("0x...")
await window.__EVAL__.getLastClaimAt("0x...")
await window.__EVAL__.getContractAddresses()
```

This is useful for browser automation and evaluation scripts.

## Docker

The Dockerfile builds a production image:

```bash
docker build -t faucet-frontend .
docker run -p 3000:3000 faucet-frontend
```

Or use docker-compose from the root directory:

```bash
docker compose up --build
```

The Docker build:
1. Installs dependencies
2. Builds with Vite
3. Serves static files via Nginx on port 3000

## Tech Stack

- React 19
- Vite 7
- ethers.js 6
- Nginx (production)

## Troubleshooting

**Blank page or console errors about addresses**
- Make sure `.env` has the correct contract addresses
- Contract addresses must start with `0x`

**MetaMask not detected**
- Install MetaMask browser extension
- Refresh the page after installing

**Wrong network**
- Switch MetaMask to Sepolia testnet
- The RPC URL in `.env` should point to Sepolia

**Build fails in Docker**
- Pass environment variables as build args:
  ```bash
  docker build --build-arg VITE_TOKEN_ADDRESS=0x... .
  ```
