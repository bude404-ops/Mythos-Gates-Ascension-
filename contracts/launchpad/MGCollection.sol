// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Mythos Gates: Ascension — NFT Collection
/// @notice ERC-721 collection for deity skins, cosmetic items, and collectible assets
/// @dev Each NFT represents an in-game cosmetic or collectible with metadata URI
contract MGCollection is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant LAUNCHPAD_ROLE = keccak256("LAUNCHPAD_ROLE");

    Counters.Counter private _tokenIds;

    // Collection metadata
    string public collectionName;
    uint256 public maxSupply;
    uint256 public mintedCount;
    bool public mintingActive;

    // Token types
    enum TokenType { DEITY_SKIN, CREATURE, WEAPON_SKIN, FACTION_BANNER, TITLE, PROFILE_EFFECT }
    mapping(uint256 => TokenType) public tokenType;

    // Rarity tiers
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, MYTHIC }
    mapping(uint256 => Rarity) public tokenRarity;

    // Faction binding (0 = unbound)
    mapping(uint256 => uint8) public tokenFaction; // 1-7 for factions, 0 for universal

    // Events
    event Minted(address indexed to, uint256 indexed tokenId, TokenType tokenType, Rarity rarity);
    event MintingStatusChanged(bool active);
    event MaxSupplyUpdated(uint256 newMax);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _collectionName,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        collectionName = _collectionName;
        maxSupply = _maxSupply;
        mintingActive = false;
    }

    modifier whenMintingActive() {
        require(mintingActive, "Minting is not active");
        require(mintedCount < maxSupply, "Max supply reached");
        _;
    }

    /// @notice Mint a single NFT (called by launchpad or minter)
    function mint(
        address to,
        TokenType _type,
        Rarity _rarity,
        uint8 _faction,
        string memory _tokenURI
    ) external onlyRole(MINTER_ROLE) whenMintingActive returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        _tokenIds.increment();
        mintedCount++;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        tokenType[newTokenId] = _type;
        tokenRarity[newTokenId] = _rarity;
        tokenFaction[newTokenId] = _faction;

        emit Minted(to, newTokenId, _type, _rarity);
        return newTokenId;
    }

    /// @notice Batch mint for presale/giveaway
    function batchMint(
        address[] calldata recipients,
        TokenType _type,
        Rarity _rarity,
        uint8 _faction,
        string[] calldata _tokenURIs
    ) external onlyRole(MINTER_ROLE) whenMintingActive returns (uint256[] memory) {
        require(recipients.length == _tokenURIs.length, "Array length mismatch");
        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            require(mintedCount < maxSupply, "Max supply reached");
            uint256 newTokenId = _tokenIds.current();
            _tokenIds.increment();
            mintedCount++;

            _safeMint(recipients[i], newTokenId);
            _setTokenURI(newTokenId, _tokenURIs[i]);
            tokenType[newTokenId] = _type;
            tokenRarity[newTokenId] = _rarity;
            tokenFaction[newTokenId] = _faction;

            emit Minted(recipients[i], newTokenId, _type, _rarity);
            tokenIds[i] = newTokenId;
        }
        return tokenIds;
    }

    /// @notice Toggle minting on/off
    function setMintingActive(bool _active) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintingActive = _active;
        emit MintingStatusChanged(_active);
    }

    /// @notice Update max supply (can only increase)
    function setMaxSupply(uint256 _newMax) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newMax >= mintedCount, "Cannot reduce below minted");
        maxSupply = _newMax;
        emit MaxSupplyUpdated(_newMax);
    }

    /// @notice Get token metadata
    function getTokenInfo(uint256 tokenId) external view returns (
        TokenType _type,
        Rarity _rarity,
        uint8 _faction,
        string memory _uri
    ) {
        require(_exists(tokenId), "Token does not exist");
        return (tokenType[tokenId], tokenRarity[tokenId], tokenFaction[tokenId], tokenURI(tokenId));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
