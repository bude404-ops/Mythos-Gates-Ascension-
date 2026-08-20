// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./MGCollection.sol";

/// @title Mythos Gates: Ascension — NFT Launchpad
/// @notice Handles presale, public mint, and whitelist for Mythos Gates NFT collections
/// @dev Launchpad manages mint pricing, whitelist, and fund distribution
contract MGLaunchpad is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant COLLECTION_ROLE = keccak256("COLLECTION_ROLE");

    MGCollection public collection;

    // Sale phases
    enum SalePhase { INACTIVE, PRESALE, PUBLIC, CLOSED }
    SalePhase public currentPhase;

    // Pricing (in wei)
    uint256 public presalePrice;
    uint256 public publicPrice;

    // Whitelist
    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public whitelistMintCount;
    uint256 public maxWhitelistMints = 2;
    uint256 public totalWhitelisted;

    // Per-wallet limits
    uint256 public maxMintsPerWallet;
    mapping(address => uint256) public walletMintCount;

    // Fund distribution
    address public treasury;
    uint256 public treasuryBps = 9000; // 90%
    address public devWallet;
    uint256 public devBps = 1000; // 10%

    // Sale stats
    uint256 public totalRevenue;
    uint256 public totalMints;

    // Token type for this launchpad
    MGCollection.TokenType public launchTokenType;

    // Events
    event PhaseChanged(SalePhase newPhase);
    event PriceUpdated(SalePhase phase, uint256 newPrice);
    event WhitelistUpdated(address indexed user, bool status);
    event Minted(address indexed to, uint256 indexed tokenId, uint256 price);
    event RevenueDistributed(uint256 treasuryAmount, uint256 devAmount);

    constructor(
        address _collection,
        address _treasury,
        address _devWallet,
        uint256 _presalePrice,
        uint256 _publicPrice,
        uint256 _maxMintsPerWallet,
        MGCollection.TokenType _tokenType
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        collection = MGCollection(_collection);
        treasury = _treasury;
        devWallet = _devWallet;
        presalePrice = _presalePrice;
        publicPrice = _publicPrice;
        maxMintsPerWallet = _maxMintsPerWallet;
        launchTokenType = _tokenType;
        currentPhase = SalePhase.INACTIVE;
    }

    modifier duringSale() {
        require(currentPhase == SalePhase.PRESALE || currentPhase == SalePhase.PUBLIC, "Sale not active");
        _;
    }

    /// @notice Mint during presale (whitelist only)
    function presaleMint(string calldata _tokenURI) external payable nonReentrant duringSale returns (uint256) {
        require(currentPhase == SalePhase.PRESALE, "Presale not active");
        require(isWhitelisted[msg.sender], "Not whitelisted");
        require(whitelistMintCount[msg.sender] < maxWhitelistMints, "Whitelist mint limit reached");
        require(msg.value >= presalePrice, "Insufficient payment");

        whitelistMintCount[msg.sender]++;
        walletMintCount[msg.sender]++;
        totalMints++;
        totalRevenue += msg.value;

        uint256 tokenId = collection.mint(msg.sender, launchTokenType, MGCollection.Rarity.EPIC, 0, _tokenURI);
        emit Minted(msg.sender, tokenId, msg.value);
        _distributeRevenue();
        return tokenId;
    }

    /// @notice Mint during public sale
    function publicMint(MGCollection.Rarity _rarity, uint8 _faction, string calldata _tokenURI) external payable nonReentrant duringSale returns (uint256) {
        require(currentPhase == SalePhase.PUBLIC, "Public sale not active");
        require(walletMintCount[msg.sender] < maxMintsPerWallet, "Wallet mint limit reached");
        require(msg.value >= publicPrice, "Insufficient payment");

        walletMintCount[msg.sender]++;
        totalMints++;
        totalRevenue += msg.value;

        uint256 tokenId = collection.mint(msg.sender, launchTokenType, _rarity, _faction, _tokenURI);
        emit Minted(msg.sender, tokenId, msg.value);
        _distributeRevenue();
        return tokenId;
    }

    /// @notice Admin: Add addresses to whitelist
    function addToWhitelist(address[] calldata users) external onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < users.length; i++) {
            if (!isWhitelisted[users[i]]) {
                isWhitelisted[users[i]] = true;
                totalWhitelisted++;
                emit WhitelistUpdated(users[i], true);
            }
        }
    }

    /// @notice Admin: Remove from whitelist
    function removeFromWhitelist(address user) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isWhitelisted[user] = false;
        totalWhitelisted--;
        emit WhitelistUpdated(user, false);
    }

    /// @notice Admin: Set sale phase
    function setPhase(SalePhase _phase) external onlyRole(DEFAULT_ADMIN_ROLE) {
        currentPhase = _phase;
        emit PhaseChanged(_phase);
    }

    /// @notice Admin: Set prices
    function setPrices(uint256 _presale, uint256 _public) external onlyRole(DEFAULT_ADMIN_ROLE) {
        presalePrice = _presale;
        publicPrice = _public;
        emit PriceUpdated(SalePhase.PRESALE, _presale);
        emit PriceUpdated(SalePhase.PUBLIC, _public);
    }

    /// @notice Admin: Set wallet limits
    function setMaxMints(uint256 _maxWhitelist, uint256 _maxPublic) external onlyRole(DEFAULT_ADMIN_ROLE) {
        maxWhitelistMints = _maxWhitelist;
        maxMintsPerWallet = _maxPublic;
    }

    /// @notice Distribute revenue to treasury and dev wallet
    function _distributeRevenue() internal {
        uint256 balance = address(this).balance;
        if (balance == 0) return;

        uint256 treasuryAmount = (balance * treasuryBps) / 10000;
        uint256 devAmount = balance - treasuryAmount;

        (bool treasurySuccess, ) = treasury.call{value: treasuryAmount}("");
        (bool devSuccess, ) = devWallet.call{value: devAmount}("");

        require(treasurySuccess && devSuccess, "Revenue distribution failed");
        emit RevenueDistributed(treasuryAmount, devAmount);
    }

    /// @notice Admin: Withdraw stuck funds
    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        (bool success, ) = treasury.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /// @notice Admin: Set distribution split
    function setDistribution(uint256 _treasuryBps, uint256 _devBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_treasuryBps + _devBps == 10000, "Must sum to 10000");
        treasuryBps = _treasuryBps;
        devBps = _devBps;
    }

    /// @notice Get sale info
    function getSaleInfo() external view returns (
        SalePhase phase,
        uint256 presaleCost,
        uint256 publicCost,
        uint256 minted,
        uint256 revenue,
        uint256 whitelistCount
    ) {
        return (currentPhase, presalePrice, publicPrice, totalMints, totalRevenue, totalWhitelisted);
    }
}
