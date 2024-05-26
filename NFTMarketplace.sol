// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title NFT Marketplace
 * @dev Implements a marketplace for trading NFTs safely
 */
contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    using Address for address;

    Counters.Counter private _listingId;
    mapping(uint256 => Listing) private _listings;
    mapping(address => mapping(uint256 => bool)) private _activeListings;

    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
    }

    // Events declaration for emitting on actions
    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        bool sold
    );

    event NFTPurchased(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    // Modifiers for reusability and readability
    modifier onlyNFTOwner(address nftContract, uint256 tokenId) {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Caller is not the NFT owner");
        _;
    }

    /**
     * @dev Lists an NFT on the marketplace
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID of the NFT to list
     * @param price Sale price for the NFT
     */
    function listNFT(address nftContract, uint256 tokenId, uint256 price) 
        external 
        nonReentrant 
        onlyNFTOwner(nftContract, tokenId) 
    {
        require(!_activeListings[nftContract][tokenId], "NFT already listed");
        require(price > 0, "Price must be greater than zero");

        _listingId.increment();
        uint256 listingId = _listingId.current();

        _listings[listingId] = Listing(listingId, nftContract, tokenId, payable(msg.sender), price, false);
        _activeListings[nftContract][tokenId] = true;

        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price, false);
    }

    /**
     * @dev Buys an NFT listed on the marketplace
     * @param nftContract Address of the NFT contract
     * @param listingId ID of the listed NFT
     */
    function buyNFT(address nftContract, uint256 listingId) 
        external 
        payable 
        nonReentrant 
    {
        Listing memory listing = _listings[listingId];
        require(listing.seller != address(0), "Listing does not exist");
        require(!listing.sold, "NFT has already been sold");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.seller.transfer(listing.price);
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        _listings[listingId].sold = true;
        _activeListings[nftContract][listing.tokenId] = false;

        emit NFTPurchased(listingId, nftContract, listing.tokenId, msg.sender, listing.price);
    }

    /**
     * @dev Retrieves details about a specific listing
     * @param listingId ID of the listing to query
     * @return Listing details as a structured object
     */
    function getListing(uint256 listingId) public view returns (Listing memory) {
        require(_listings[listingId].seller != address(0), "Listing does not exist");
        return _listings[listingId];
    }
}