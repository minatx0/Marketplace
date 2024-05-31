import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateListing from './CreateListing';
import Marketplace from './Marketplace';

const NFTMarketplace: React.FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          } else {
            console.error('No accounts found');
          }
        } catch (error) {
          console.error('Error accessing user Ethereum account:', error);
        }
      } else {
        console.error('Ethereum object not found, you need to install MetaMask!');
      }
    };

    loadWeb3();
  }, []);

  return (
    <div>
      <h1>NFT Marketplace</h1>
      {userAddress && <p>Connected as: {userAddress}</p>}
      {web3 ? (
        <>
          <CreateListing web3={web3} userAddress={userAddress}/>
          <Marketplace web3={web3} />
        </>
      ) : (
        <p>Loading Web3...</p>
      )}
    </div>
  );
};

export default NFTMarketplace;