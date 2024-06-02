import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateListing from './CreateListing';
import Marketplace from './Marketplace';

const NFTMarketplace: React.FC = () => {
  const [web3Instance, setWeb3Instance] = useState<Web3>();
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const initializedWeb3 = new Web3(window.ethereum);
          setWeb3Instance(initializedWeb3);
          const accounts = await initializedWeb3.eth.getAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            console.error('No Ethereum accounts found');
          }
        } catch (error) {
          console.error('Error accessing the Ethereum accounts:', error);
        }
      } else {
        console.error('Ethereum interface not detected. Please install MetaMask!');
      }
    };

    initializeWeb3();
  }, []);

  return (
    <div>
      <h1>NFT Marketplace</h1>
      {walletAddress && <p>Connected as: {walletAddress}</p>}
      {web3Instance ? (
        <>
          <CreateListing web3={web3Instance} userAddress={walletAddress}/>
          <Marketplace web3={web3Instance} />
        </>
      ) : (
        <p>Initializing connection to blockchain...</p>
      )}
    </div>
  );
};

export default NFTMarketplace;