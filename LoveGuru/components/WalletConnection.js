"use client";

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function WalletConnection() {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isConnected) {
      console.log('Connected to chain:', chain?.id);
      if (chain?.id !== 12227332) {
        console.log('Please switch to NeoX T4 TestNet');
      }
    }
  }, [isConnected, chain]);

  const handleConnect = async () => {
    await open();
  };

  if (isConnected) {
    return (
      <div className="flex flex-col items-end space-y-2 relative">
      
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full transition duration-300 text-sm w-32"
          onClick={() => disconnect()}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          Disconnect
        </button>
        {showTooltip && (
          <div className="absolute top-full mt-2 right-0 bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-lg text-xs">
            <p>Connected to {chain?.name || 'Unknown Network'}</p>
            <p>Address: {address}</p>
            <p>Click to disconnect</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-full transition duration-300 text-sm w-32"
      onClick={handleConnect}
    >
      Connect Wallet
    </button>
  );
}