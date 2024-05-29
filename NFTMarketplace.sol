pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    using Address for address;

    Counters.Counter private _listingCounter;
    mapping(uint256 => Listing) private _listings;
    mapping(address => mapping(uint256 => bool)) private _listedNFTs;

    struct Listing {
        uint256 id;
        address nftAddress;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isSold;
    }

    event NFTListed(
        uint256 id,
        address nftAddress,
        uint256 tokenId,
        address seller,
        uint256 price,
        bool isSold
    );

    event NFTSold(
        uint256 id,
        address nftAddress,
        uint256 tokenId,
        address buyer,
        uint256 paidPrice
    );

    modifier isNFTOwner(address nftAddress, uint256 tokenId) {
        IERC721 nftToken = IERC721(nftAddress);
        require(nftToken.ownerOf(tokenId) == msg.sender, "Caller is not the NFT owner");
        _;
    }

    function listNFT(address nftAddress, uint256 tokenId, uint256 price) 
        external 
        nonReentrant 
        isNFTOwner(nftAddress, tokenId) 
    {
        require(!_listedNFTs[nftAddress][tokenId], "NFT is already listed");
        require(price > 0, "Price must be above zero");

        _listingCounter.increment();
        uint256 newListingId = _listingCounter.current();

        _listings[newListingId] = Listing(newListingId, nftAddress, tokenId, payable(msg.sender), price, false);
        _listedNFTs[nftAddress][tokenId] = true;

        emit NFTListed(newListingId, nftAddress, tokenId, msg.sender, price, false);
    }

    function purchaseNFT(address nftAddress, uint256 listingId) 
        external 
        payable 
        nonReentrant 
    {
        Listing storage listing = _listings[listingId];
        require(listing.seller != address(0), "Listing does not exist");
        require(!listing.isSold, "NFT is already sold");
        require(msg.value >= listing.price, "Insufficient funds to purchase NFT");

        listing.seller.transfer(listing.price);
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        listing.isSold = true;
        _listedNFTs[nftAddress][listing.tokenId] = false;

        emit NFTSold(listingId, nftAddress, listing.tokenId, msg.sender, listing.price);
    }

    function getListingDetails(uint256 listingId) public view returns (Listing memory) {
        require(_listings[listingId].seller != address(0), "Listing does not exist");
        return _listings[listingId];
    }
}