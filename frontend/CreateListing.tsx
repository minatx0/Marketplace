import React, { useState } from 'react';
import Web3 from 'web3';
import NFTContractABI from './NFTContractABI.json';

const CreateNFTListingForm: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const web3 = new Web3(process.env.REACT_APP_PROVIDER_URL);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const nftContract = new web3.eth.Contract(
        NFTContractABI as any,
        contractAddress,
      );
      const accounts = await web3.eth.getAccounts();

      await nftContract.methods
        .createListing(tokenId, web3.utils.toWei(price, 'ether'))
        .send({ from: accounts[0] });
      
      alert('NFT Listing created successfully!');
    } catch (error) {
      console.error('Error creating NFT listing: ', error);
      alert('Failed to create listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="contractAddress">Contract Address</label>
        <input
          type="text"
          id="contractAddress"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="tokenId">Token ID</label>
        <input
          type="text"
          id="tokenId"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="price">Price (ETH)</label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Listing'}
      </button>
    </form>
  );
};

export default CreateNFTListingForm;