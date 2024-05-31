pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    using Address for address;

    Counters.Counter private _totalListings; 
    mapping(uint256 => Listing) private _listingsMap; 
    mapping(address => mapping(uint256 => bool)) private _isNFTListed; 

    struct Listing {
        uint256 listingId;
        address nftContractAddress;
        uint256 tokenId;
        address payable sellerAddress;
        uint256 listingPrice;
        bool soldStatus;
    }

    event NFTListed(
        uint256 listingId,
        address nftContractAddress,
        uint256 tokenId,
        address sellerAddress,
        uint256 listingPrice,
        bool soldStatus
    );

    event NFTSold(
        uint256 listingId,
        address nftContractAddress,
        uint256 tokenId,
        address buyerAddress,
        uint256 paidPrice
    );

    modifier ownerOfNFT(address nftContractAddress, uint256 tokenId) {
        IERC721 nftToken = IERC721(nftContractAddress);
        require(nftToken.ownerOf(tokenId) == msg.sender, "Caller is not the NFT owner");
        _;
    }

    function listNFT(address nftContractAddress, uint256 tokenId, uint256 price) 
        external 
        nonReentrant 
        ownerOfNFT(nftContractAddress, tokenId) 
    {
        require(!_isNFTListed[nftContractAddress][tokenId], "NFT is already listed");
        require(price > 0, "Price must be above zero");

        _totalListings.increment();
        uint256 newListingId = _totalListings.current();

        _listingsMap[newListingId] = Listing(newListingId, nftContractAddress, tokenId, payable(msg.sender), price, false);
        _isNFTListed[nftContractAddress][tokenId] = true;

        emit NFTListed(newListingId, nftContractAddress, tokenId, msg.sender, price, false);
    }

    function purchaseNFT(address nftContractAddress, uint256 listingId) 
        external 
        payable 
        nonReentrant 
    {
        Listing storage listing = _listingsMap[listingId];
        require(listing.sellerAddress != address(0), "Listing does not exist");
        require(!listing.soldStatus, "NFT is already sold");
        require(msg.value >= listing.listingPrice, "Insufficient funds to purchase NFT");

        listing.sellerAddress.transfer(listing.listingPrice);
        IERC721(nftContractAddress).safeTransferFrom(listing.sellerAddress, msg.sender, listing.tokenId);

        listing.soldStatus = true;
        _isNFTListed[nftContractAddress][listing.tokenId] = false;

        emit NFTSold(listingId, nftContractAddress, listing.tokenId, msg.sender, listing.listingPrice);
    }

    function getListingDetails(uint256 listingId) public view returns (Listing memory) {
        require(_listingsMap[listingId].sellerAddress != address(0), "Listing does not exist");
        return _listingsMap[listingId];
    }
}