import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NFTContractABI from './NFTContractABI.json';

const web3Instance = new Web3(process.env.REACT_APP_PROVIDER_URL);

const NFTListingForm: React.FC = () => {
  const [nftContractAddress, setNFTContractAddress] = useState<string>('');
  const [nftTokenId, setNFTTokenId] = useState<string>('');
  const [listingPriceETH, setListingPriceETH] = useState<string>('');
  const [isListingInProgress, setIsListingInProgress] = useState<boolean>(false);
  const [nftContractInstance, setNFTContractInstance] = useState<any>(null);
  const [userAccountAddress, setUserAccountAddress] = useState<string>('');

  useEffect(() => {
    const loadUserAccount = async () => {
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setUserAccountAddress(accounts[0]);
      }
    };

    loadUserXAccount();
  }, []);

  useEffect(() => {
    if (!nftContractAddress) return;
    
    const newContractInstance = new web3Instance.eth.Contract(NFTContractABI as any, nftyContractAddress);
    setNFTContractInstance(newContractInstance);
  }, [nftContractAddress]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nftContractInstance || !userAccountAddress) return;

    setIsListingInProgress(true);

    try {
      await nftContractInstance.methods
        .createListing(nftTokenId, web3Instance.utils.toWei(listingPriceETH, 'ether'))
        .send({ from: userAccountAddress });
      
      alert('NFT Listing created successfully!');
    } catch (error) {
      console.error('Error creating NFT listing: ', error);
      alert('Failed to create the listing.');
    } finally {
      setIsListingInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nftContractAddress">Contract Address</label>
        <input
          type="text"
          id="nftContractAddress"
          value={nftContractAddress}
          onChange={(e) => setNFTContractAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="nftTokenId">Token ID</label>
        <input
          type="text"
          id="nftTokenId"
          value={nftTokenId}
          onChange={(e) => setNFTTokenId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="listingPriceETH">Price (ETH)</label>
        <input
          type="text"
          id="listingPriceETH"
          value={listingPriceETH}
          onChange={(e) => setListingPriceETH(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isListingInProgress}>
        {isListingInProgress ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
};

export default NFTListingForm;