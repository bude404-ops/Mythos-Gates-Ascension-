# Mythos Gates: Ascension — NFT Launchpad Smart Contracts

## Contracts

### 1. MGCollection.sol (ERC-721)
NFT collection for deity skins, weapon skins, creature collectibles, faction banners, titles, and profile effects.

- Role-based minting (MINTER_ROLE)
- Token types: DEITY_SKIN, CREATURE, WEAPON_SKIN, FACTION_BANNER, TITLE, PROFILE_EFFECT
- Rarity tiers: COMMON, RARE, EPIC, LEGENDARY, MYTHIC
- Faction binding (1-7 or 0 for universal)
- Max supply control
- Batch minting for presale/giveaways

### 2. MGLaunchpad.sol (Sale Contract)
Launchpad for presale and public mint phases.

- Whitelist with per-wallet limits
- Presale and public sale phases
- Price management (presale vs public)
- Revenue split (treasury 90% / dev 10%)
- Reentrancy guarded
- Fund distribution on each mint

### 3. MGRewards.sol (ERC-20)
In-game reward token (MGA) earned by playing.

- Minted by game backend based on achievements
- Daily reward cap per player (500 MGA/day)
- Max supply: 100M MGA
- Reward rates: mission, boss, daily, raid, arena
- Burnable for ascension purchases

## Deployment Order

1. Deploy MGCollection.sol
2. Deploy MGLaunchpad.sol (pass collection address)
3. Deploy MGRewards.sol
4. Grant MINTER_ROLE on MGCollection to MGLaunchpad
5. Set collection minting active
6. Add whitelist addresses
7. Set presale phase
8. Start presale

## Network: To be decided (Ethereum L2 / Polygon / Base)

## Dependencies
- OpenZeppelin Contracts v4.x
- Solidity 0.8.20+

## Status
- Contracts drafted: August 20, 2026
- Pending: Security audit, test suite, deployment scripts
- Next: Hardhat/Foundry setup + unit tests
