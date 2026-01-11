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

const COOLDOWN_SECONDS = 86400;

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState("0");
  const [remaining, setRemaining] = useState("0");
  const [canRequest, setCanRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [gasCost, setGasCost] = useState(null);

  useEffect(() => {
    exposeEval();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function connect() {
    try {
      setLoading(true);
      setStatus("🔐 Connecting wallet...");
      const addr = await connectWallet();
      setWallet(addr);
      setStatus("✅ Wallet connected!");
      await refresh(addr);
    } catch {
      setStatus("❌ Connection failed. Is MetaMask installed?");
    } finally {
      setLoading(false);
    }
  }

  async function refresh(address) {
    try {
      const bal = await getBalance(address);
      const rem = await getRemainingAllowance(address);
      const allowed = await canClaim(address);

      const balFormatted = (Number(bal) / 1e18).toFixed(2);
      const remFormatted = (Number(rem) / 1e18).toFixed(0);

      setBalance(balFormatted);
      setRemaining(remFormatted);
      setCanRequest(allowed);

      if (!allowed) {
        const last = await window.__EVAL__.getLastClaimAt(address);
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, COOLDOWN_SECONDS - (now - Number(last)));
        setCooldown(remaining);
      } else {
        setCooldown(0);
      }

      await estimateGas();
    } catch {
      setStatus("⚠️ Please switch MetaMask to Sepolia network");
    }
  }

  async function estimateGas() {
    try {
      const gasPrice = await window.ethereum.request({
        method: "eth_gasPrice",
      });
      const estimatedEth = (100_000 * Number(gasPrice)) / 1e18;
      setGasCost(estimatedEth.toFixed(6));
    } catch {
      setGasCost(null);
    }
  }

  async function claim() {
    try {
      setLoading(true);
      setStatus("⏳ Confirm transaction in MetaMask...");
      await requestTokens();
      setStatus("🎉 Tokens claimed successfully!");
      await refresh(wallet);
    } catch (err) {
      if (err.message?.includes("Cooldown")) {
        setStatus("⏱️ Cooldown active. Please wait 24 hours.");
      } else if (err.message?.includes("limit")) {
        setStatus("🚫 Lifetime claim limit reached.");
      } else {
        setStatus("❌ Transaction failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function formatCooldown(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="logo-container">
          <div className="token-icon">💧</div>
        </div>

        <h1>ERC-20 Token Faucet</h1>
        <p className="subtitle">Claim Free Testnet Tokens</p>

        <div className="network-badge">Sepolia Testnet</div>

        {!wallet ? (
          <button className="primary" onClick={connect} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>🔐 Connect Wallet</>
            )}
          </button>
        ) : (
          <>
            <div className="info">
              <div>
                <span>💳 Wallet</span>
                <strong
                  onClick={() => navigator.clipboard.writeText(wallet)}
                  style={{ cursor: "pointer" }}
                  title="Click to copy"
                >
                  {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </strong>
              </div>

              <div>
                <span>💰 Balance</span>
                <strong>{balance} FTK</strong>
              </div>

              <div>
                <span>🎯 Remaining</span>
                <strong>{remaining} FTK</strong>
              </div>
            </div>

            {gasCost && (
              <div className="gas">
                ⛽ Est. Gas: <strong>{gasCost} ETH</strong>
              </div>
            )}

            <button
              className="primary"
              onClick={claim}
              disabled={!canRequest || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : canRequest ? (
                <>💧 Claim 100 FTK</>
              ) : (
                <>⏱️ Cooldown Active</>
              )}
            </button>

            {!canRequest && cooldown > 0 && (
              <p className="status cooldown">
                ⏱️ Next claim in {formatCooldown(cooldown)}
              </p>
            )}
          </>
        )}

        {status && <p className="status">{status}</p>}

        <div className="footer">
          Open DevTools Console → <code>window.__EVAL__</code>
        </div>
      </div>
    </div>
  );
}

export default App;
