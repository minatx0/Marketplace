import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface NFTListing {
  id: string;
  title: string;
  image: string;
  price: number;
}

const NFT_CONTRACT_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "fetchListings",
    "outputs": [
    ],
    "type": "function",
  },
];
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS;

const NFTListings: React.FC = () => {
  const [listings, setListings] = useState<NFTListing[]>([]);

  useEffect(() => {
    const fetchNFTListings = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
          const data: NFTListing[] = await contract.fetchListings();
          setListings(data);
        }
      } catch (error) {
        console.error('Failed to fetch NFT listings:', error);
      }
    };

    fetchNFTListings();
  }, []);

  return (
    <div>
      {listings.length > 0 ? (
        listings.map((listing) => (
          <div key={listing.id}>
            <h3>{listing.title}</h3>
            <img src={listing.image} alt={listing.title} />
            <p>Price: {listing.price} ETH</p>
            <button>Buy NFT</button>
          </div>
        ))
      ) : (
        <p>No listings available</p>
      )}
    </div>
  );
};

export default NFTListings;