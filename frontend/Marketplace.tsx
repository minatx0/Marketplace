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
const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_NFT_CONTRACT_ADDRESS || '';

const CACHE_DURATION = 300000; // 5 minutes

const NFTListings: React.FC = () => {
  const [listings, setListings] = useState<NFTListing[]>([]);

  useEffect(() => {
    const fetchNFTListings = async () => {
      try {
        const cachedListings = getCachedListings();
        if (cachedListings) {
          setListings(cachedListings);
          return;
        }

        if (typeof window.ethereum !== 'undefined') {
          const freshListings = await fetchListingsFromBlockchain();
          setListings(freshListings);
          cacheListings(freshListings);
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

async function fetchListingsFromBlockchain(): Promise<NFTListing[]> {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
  return contract.fetchListings();
}

function getCachedListings(): NFTListing[] | null {
  const listingsCache = localStorage.getItem('nftListingsCache');
  if (!listingsCache) return null;

  const { timestamp, data } = JSON.parse(listingsCache);
  const isCacheValid = new Date().getTime() - timestamp < CACHE_DURATION;
  return isCacheValid ? data : null;
}

function cacheListings(listings: NFTListing[]): void {
  const timestamp = new Date().getTime();
  localStorage.setItem('nftListingsCache', JSON.stringify({ timestamp, data: listings }));
}

export default NFTListings;