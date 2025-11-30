import React, { useState, useEffect } from 'react';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';
import './stellarwalletconnection.css';
import stellarLogo from "../../assets/stellar-xlm-logo.svg";
import FetchAssets from '../../modules/FetchAssets';

const StellarWalletConnection = ({ onConnect }) => {
  const [connectedWalletPublicKey, setConnectedWalletPublicKey] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start the kit once in the browser
    if (typeof window !== 'undefined') {
      try {
        StellarWalletsKit.init({ modules: defaultModules() });
      } catch (e) {
        // init may throw if already initialized -- ignore
      }
    }
  }, []);

  const connectWallet = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      if (address) {
        setConnectedWalletPublicKey(address);
        onConnect({ publicKey: address, kit: StellarWalletsKit });
      }
    } catch (err) {
      // user probably dismissed modal or no wallet available
      console.warn('Auth modal closed or failed', err);
    }
  };

  useEffect(() => {
    const fetchConnectedWallet = async () => {
      try {
        const { address } = await StellarWalletsKit.getAddress();
        if (address) {
          setConnectedWalletPublicKey(address);
          onConnect({ publicKey: address, kit: StellarWalletsKit });
        }
      } catch (error) {
        // Wallet not connected yet
      }
    };

    fetchConnectedWallet();
  }, []);

  const abbreviate = (addr) => `${addr.slice(0, 3)}...${addr.slice(-4)}`;

  useEffect(() => {
    const loadAssets = async () => {
      if (!connectedWalletPublicKey) return;
      setLoading(true);
      const result = await FetchAssets(connectedWalletPublicKey);
      setAssets(result);
      setLoading(false);
    };
    loadAssets();
  }, [connectedWalletPublicKey]);

  return (
    <div className="wallet-feature">
      <h1>Stellar Wallet Connection</h1>

      {connectedWalletPublicKey ? (
        <div className="wallet-connected-btn">
          <span className="wallet-address">{abbreviate(connectedWalletPublicKey)}</span>
          <img src={stellarLogo} alt="Stellar Icon" className="stellar-icon" />
        </div>
      ) : (
        <button className="custom-wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <span className="connection-status">
        {connectedWalletPublicKey ? `Address: ${connectedWalletPublicKey}` : "Not connected"}
      </span>

      <div className="wallet-assets">
        {!connectedWalletPublicKey ? (
          <p>Connect your wallet to Stellar Testnet.</p>
        ) : loading ? (
          <p>Loading balances...</p>
        ) : assets.length === 0 ? (
          <p>No assets found.</p>
        ) : (
          <ul>
            {assets.map((a, i) => (
              <li key={i}>
                {a.asset_type === 'native'
                  ? `XLM: ${parseFloat(a.balance).toFixed(2)}`
                  : `${a.asset_code}: ${parseFloat(a.balance).toFixed(2)} (issuer: ${a.asset_issuer.slice(0, 6)}...)`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StellarWalletConnection;
