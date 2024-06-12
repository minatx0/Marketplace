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

// Duration to cache listings, e.g., 5 minutes (300000 milliseconds)
const CACHE_DURATION = 300000;

const NFTListings: React.FC = () => {
  const [listings, setListings] = useState<NFTListing[]>([]);

  useEffect(() => {
    const fetchNFTListings = async () => {
      try {
        // Check for existing cache
        const listingsCache = localStorage.getItem('nftListingsCache');
        const now = new Date().getTime();
        if (listingsCache) {
          const { timestamp, data } = JSON.parse(listingsCache);
          // Use cached data if it's still valid
          if (now - timestamp < CACHE_DURATION) {
            setListings(data);
            return; // Stop execution to avoid API call
          }
        }

        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
          const data: NFTListing[] = await contract.fetchListings();

          // Update state with fresh data
          setListings(data);

          // Cache the new data along with current timestamp
          localStorage.setItem('nftListingsCache', JSON.stringify({ timestamp: now, data }));
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
            <img src={listing.image} alt={listing.title} style={{ width: '100px', height: '100px' }} />
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