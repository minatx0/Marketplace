import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateListing from './CreateListing';
import Marketplace from './Marketplace';

const NFTMarketplace: React.FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');

  useEffect(() => {
    connectWallet().catch(logError);
  }, []);

  const logError = (error: any) => {
    console.error("Blockchain interaction error:", error);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccountAddress(accounts);
      } catch (error) {
        logError(error);
      }
    } else {
      console.error('MetaMask is not installed. Please install it to use this application.');
    }
  };

  const setAccountAddress = (accounts: string[]) => {
    if (accounts.length > 0) {
      setUserWalletAddress(accounts[0]);
    } else {
      console.error('No Ethereum accounts found.');
    }
  };

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