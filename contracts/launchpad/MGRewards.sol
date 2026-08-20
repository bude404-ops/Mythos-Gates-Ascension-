// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Mythos Gates: Ascension — Reward Token
/// @notice ERC-20 token earned by playing the game, used for cosmetic purchases and ascension
/// @dev Minted by game backend (backend minter role) based on in-game achievements
contract MGRewards is ERC20, AccessControl {
    bytes32 public constant GAME_BACKEND_ROLE = keccak256("GAME_BACKEND_ROLE");

    uint256 public constant DAILY_REWARD_CAP = 500 * 10**18; // 500 tokens/day per player
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M max

    mapping(address => uint256) public dailyRewarded;
    mapping(address => uint256) public lastRewardDay;

    // Reward rates (in tokens, before decimals)
    struct RewardRates {
        uint256 missionComplete;
        uint256 bossDefeat;
        uint256 dailyChallenge;
        uint256 raidComplete;
        uint256 arenaWin;
    }

    RewardRates public rates;
    uint256 public totalMinted;

    event RewardsClaimed(address indexed player, uint256 amount, string reason);

    constructor() ERC20("Mythos Gates Ascension", "MGA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_BACKEND_ROLE, msg.sender);

        rates = RewardRates({
            missionComplete: 50 * 10**18,
            bossDefeat: 100 * 10**18,
            dailyChallenge: 75 * 10**18,
            raidComplete: 150 * 10**18,
            arenaWin: 25 * 10**18
        });
    }

    /// @notice Game backend: Reward a player for in-game achievement
    function rewardPlayer(address player, uint256 amount, string calldata reason) external onlyRole(GAME_BACKEND_ROLE) {
        require(totalMinted + amount <= MAX_SUPPLY, "Max supply exceeded");

        // Daily cap check
        uint256 currentDay = block.timestamp / 1 days;
        if (lastRewardDay[player] != currentDay) {
            dailyRewarded[player] = 0;
            lastRewardDay[player] = currentDay;
        }
        require(dailyRewarded[player] + amount <= DAILY_REWARD_CAP, "Daily reward cap exceeded");

        dailyRewarded[player] += amount;
        totalMinted += amount;
        _mint(player, amount);
        emit RewardsClaimed(player, amount, reason);
    }

    /// @notice Batch reward multiple players
    function batchReward(address[] calldata players, uint256[] calldata amounts, string calldata reason) external onlyRole(GAME_BACKEND_ROLE) {
        require(players.length == amounts.length, "Array length mismatch");
        for (uint256 i = 0; i < players.length; i++) {
            require(totalMinted + amounts[i] <= MAX_SUPPLY, "Max supply exceeded");
            uint256 currentDay = block.timestamp / 1 days;
            if (lastRewardDay[players[i]] != currentDay) {
                dailyRewarded[players[i]] = 0;
                lastRewardDay[players[i]] = currentDay;
            }
            if (dailyRewarded[players[i]] + amounts[i] > DAILY_REWARD_CAP) continue;

            dailyRewarded[players[i]] += amounts[i];
            totalMinted += amounts[i];
            _mint(players[i], amounts[i]);
            emit RewardsClaimed(players[i], amounts[i], reason);
        }
    }

    /// @notice Admin: Update reward rates
    function setRates(RewardRates calldata _rates) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rates = _rates;
    }

    /// @notice Burn tokens (used for ascension purchases)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
