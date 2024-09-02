import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import './SolanaTransactions.css'; 

const SolanaTransactions = () => {
  const [walletAddress, setWalletAddress] = useState('3Z4wXYyAhQXSzptpLnYTo6GAyvUuMfUeqSTi9wkpxnjk3Z4wXYyAhQXSzptpLnYTo6GAyvUuMfUeqSTi9wkpxnjk');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (!walletAddress) return;

      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const publicKey = new PublicKey(walletAddress);

      const transactionSignatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });

      const transactionsData = await Promise.all(
        transactionSignatures.map(async (signatureInfo) => {
          const tx = await connection.getTransaction(signatureInfo.signature);
          return tx;
        })
      );

      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  const handleAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="transaction-list">
      <h3>Enter Solana Wallet Address</h3>
      <form onSubmit={handleSubmit} className="address-form">
        <input
          type="text"
          value={walletAddress}
          onChange={handleAddressChange}
          placeholder="Enter wallet address"
          className="address-input"
        />
        <button type="submit" disabled={loading} className="reload-button">
          {loading ? 'Loading...' : 'Get Transactions'}
        </button>
      </form>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              <p><strong>Signature:</strong> {tx.transaction.signatures[0]}</p>
              <p><strong>Block Time:</strong> {new Date(tx.blockTime * 1000).toLocaleString()}</p>
              <p><strong>Slot:</strong> {tx.slot}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default SolanaTransactions;
