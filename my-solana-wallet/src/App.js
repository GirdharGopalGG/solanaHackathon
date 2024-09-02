import React from 'react';
import SolanaTransactions from './SolanaTransactions';

function App() {
  return (
    <div className="App">
      <h1>Solana Wallet Transactions</h1>
      <SolanaTransactions walletAddress="3Z4wXYyAhQXSzptpLnYTo6GAyvUuMfUeqSTi9wkpxnjk" />
    </div>
  );
}

export default App;
