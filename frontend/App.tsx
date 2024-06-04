import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateListing from './CreateListing';
import Marketplace from './Marketplace';

const NFTMarketplace: React.FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web5.eth.getAccounts();
          if (accounts.length > 0) {
            setUserWalletAddress(accounts[0]);
          } else {
            console.error('No Ethereum accounts found.');
          }
        } catch (error) {
          console.error('Failed to access Ethereum accounts:', error);
        }
      } else {
        console.error('MetaMask is not installed. Please install it to use this application.');
      }
    };

    connectWallet();
  }, []);

  return (
    <div>
      <h1>NFT Marketplace</h1>
      {userWalletAddress && <p>Connected as: {userWalletAddress}</p>}
      {web3 ? (
        <>
          <CreateListing web3={web3} userAddress={userWalletAddress} />
          <Marketplace web3={web3} />
        </>
      ) : (
        <p>Connecting to the blockchain...</p>
      )}
    </div>
  );
};

export default NFTMarketplace;