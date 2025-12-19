import { useEffect, useState } from "react";
import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
} from "./utils/contracts";
import { exposeEval } from "./utils/eval";
import "./App.css";

const COOLDOWN_SECONDS = 3600; // ⏱️ must match faucet contract

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [remaining, setRemaining] = useState("0");
  const [canRequest, setCanRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // ✅ expose window.__EVAL__
  useEffect(() => {
    exposeEval();
  }, []);

  // ⏳ countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function connect() {
    try {
      const addr = await connectWallet();
      setWallet(addr);
      setStatus("✅ Wallet connected");
      await refresh(addr);
    } catch (err) {
      setStatus("❌ Wallet connection failed");
    }
  }

  async function refresh(address) {
    try {
      const bal = await getBalance(address);
      const rem = await getRemainingAllowance(address);
      const allowed = await canClaim(address);

      setBalance(bal);
      setRemaining(rem);
      setCanRequest(allowed);

      if (!allowed) {
        const last = await window.__EVAL__.getLastClaimAt(address);
        const now = Math.floor(Date.now() / 1000);
        setCooldown(Math.max(0, COOLDOWN_SECONDS - (now - Number(last))));
      } else {
        setCooldown(0);
      }
    } catch {
      setStatus("⚠️ Switch MetaMask to Sepolia");
      setCanRequest(false);
    }
  }

  async function claim() {
    try {
      setLoading(true);
      setStatus("⏳ Requesting tokens...");
      await requestTokens();
      setStatus("✅ Tokens claimed successfully!");
      await refresh(wallet);
    } catch (err) {
      if (err.message?.includes("Cooldown")) {
        setStatus("⏱️ Cooldown active. Try again later.");
      } else {
        setStatus("❌ Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>ERC20 Token Faucet</h1>
        <p className="subtitle">Secure • Rate-Limited • Sepolia Testnet</p>

        {!wallet ? (
          <button className="primary" onClick={connect}>
            🔐 Connect Wallet
          </button>
        ) : (
          <>
            <div className="info">
              <div>
                <span>Wallet</span>
                <strong>{wallet.slice(0, 6)}…{wallet.slice(-4)}</strong>
              </div>
              <div>
                <span>Balance</span>
                <strong>{balance}</strong>
              </div>
              <div>
                <span>Remaining Allowance</span>
                <strong>{remaining}</strong>
              </div>
            </div>

            <button
              className="primary"
              onClick={claim}
              disabled={!canRequest || loading}
            >
              {loading
                ? "⏳ Processing..."
                : canRequest
                ? "💧 Request Tokens"
                : "⛔ Cooldown Active"}
            </button>

            {!canRequest && cooldown > 0 && (
              <p className="status">
                ⏱️ Next claim in {Math.ceil(cooldown / 60)} minutes
              </p>
            )}
          </>
        )}

        {status && <p className="status">{status}</p>}

        <div className="footer">
          DevTools → Console → <code>window.__EVAL__</code>
        </div>
      </div>
    </div>
  );
}

export default App;
