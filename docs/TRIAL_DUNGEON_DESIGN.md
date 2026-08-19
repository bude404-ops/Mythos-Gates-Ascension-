# MYTHOS GATES: ASCENSION — Universal Trial Dungeon

## Concept
After a player selects their deity and faction, they enter a **universal trial dungeon** — the same map/layout for all 7 factions. This trial serves as:

1. **Onboarding** — teaches core mechanics (movement, combat, abilities, objectives)
2. **Commitment ritual** — completing the trial formally binds the player to their chosen faction
3. **Narrative hook** — the trial is lore-based: the Gate tests whether the mortal is worthy to serve their chosen deity

## Player Flow
```
Deity Selection → Universal Trial Dungeon → (Pass) → Faction Campaign Begins
                                       → (Fail) → Retry (no penalty, lore: "The Gate rejects you, for now")
```

## Trial Dungeon Name: "The Gate's Judgment"

### Lore
Before the Collapse, the Mythos Gate required all who entered to prove their worth. The trial chamber exists outside of faction territory — it is neutral ground maintained by the Gate itself. The deity the player chose watches from beyond the Gate as their mortal champion faces the test.

### Map Design
- **Layout**: Single circular arena with 3 concentric rings
  - **Outer Ring**: Entry zone — tutorial movement and basic combat
  - **Middle Ring**: Ability trial — deity-specific ability puzzle (same map, different ability test per faction)
  - **Inner Ring**: Boss encounter — a Hollow Wretch (the Gate's guardian) that tests whether the player can handle real combat

### Universal Elements (Same for All Factions)
- Map layout and geometry
- Hollow Wretch boss at the center
- Tutorial prompts and mechanics teaching
- Victory condition: defeat the Hollow Wretch
- Failure condition: party wiped (retry with no penalty)

### Faction-Specific Elements (Same Map, Different Flavor)
- **Environmental tint**: The arena subtly shifts to match the chosen faction's color palette
- **Ability trial**: Each faction's middle ring tests a different mechanic:
  - Aten Ra: Light/darkness lane puzzles
  - Asgardian: Storm-timing dodge mechanics
  - Olympian: Oracle vapor sightline management
  - Kami: Phasing through spirit walls
  - Tuatha: Root-maze navigation
  - Empyrean: Radiance containment
  - Infernal Dominion: Shadow-dash through ember fissures
- **Deity dialogue**: The chosen deity speaks to the player during the trial (unique voice lines per deity)
- **Victory banner**: Upon completion, the faction's banner rises in the arena

### Map File
- Map ID: TG-MAP-000
- Name: "The Gate's Judgment"
- Realm: Universal (Gate Neutral Zone)
- Type: Trial / Tutorial

### Post-Trial
Upon defeating the Hollow Wretch:
1. The Gate opens fully — cinematic of the faction's realm revealed
2. The deity formally accepts the player as their champion
3. Campaign Mission 1 unlocks for the chosen faction
4. Player can now access the faction's campaign map and mission registry

### Difficulty
- **Easy by design** — this is a tutorial, not a challenge
- The Hollow Wretch has reduced HP and simplified attack patterns vs. campaign versions
- No permadeath risk in the trial
- Healing shrine provided between Middle Ring and Inner Ring

### Technical Notes
- One map asset, reused with faction tinting via shader/color grading
- Deity dialogue pulled from each faction's dialogue guide (280 files)
- Trial completion flag stored in player save data
- Retry counter tracked but no cap (infinite retries)

## Enhanced Gate Lore (v2 — per BudE404 direction)

The Mythos Gate is not a door. It is a **wound in reality** — a fracture that predates all 7 realms, all 28 deities, and the Collapse itself. No one built it. No one opened it. It has always been there, breathing slowly, expanding and contracting as if alive.

### What the Gate Is
- **Origin**: Unknown. Predates the deities themselves. The gods did not create the Gate — the Gate was there before the gods.
- **Appearance**: A colossal monolithic arch hundreds of feet tall, carved from dark stone that has no known geological counterpart. Abstract fracture cracks pulse with faint white light across its surface. The interior of the arch is pure unknowable darkness — not black, not void, but a darkness that suggests something vast and incomprehensible waits beyond.
- **Behavior**: The Gate breathes. The darkness within expands and contracts slowly, rhythmically. The edges shimmer with pale iridescence where reality frays. Mist drifts from its base.
- **The 7 Realms**: Each realm was born FROM the Gate — they are fractures radiating outward from the original wound. The deities themselves emerged from the Gate in the age before memory.
- **The Collapse**: The Collapse was not the Gate opening wider — it was the Gate beginning to CLOSE. As it closes, the realms it birthed are being crushed back into it. The deities are fighting to keep their realms alive.
- **The Trial**: The Gate's Judgment trial is the Gate itself testing whether a mortal has the will to enter. The Gate does not serve the deities — the deities serve the Gate, whether they admit it or not. Completing the trial is the Gate's permission, not the deity's.

### Why It Stays Mysterious
- No one knows what is beyond the Gate. Not the deities. Not the Forgotten. Not the Hollow.
- The Gate does not communicate in language. It tests through experience — the trial dungeon is its only "voice."
- Characters who stare too long into the Gate's darkness begin to forget their own name. This is a known mechanic, not a bug.
- The Gate cannot be destroyed. It cannot be fully opened. It cannot be fully closed. It can only be entered.

### Gameplay Implications
- The trial dungeon IS the Gate speaking. Its layout, its Wretch guardian, its three rings — all are the Gate's test, not the deity's.
- The deity the player chose is watching from BEYOND the Gate, not controlling it. They are as subject to the Gate's judgment as the mortal.
- Post-trial, the Gate does not close behind the player. It remains — always visible on the horizon of every realm, always breathing, always watching.
- Endgame content (post-campaign) will involve the Gate's deeper mysteries: what lies beyond, why it's closing, and what happens when it fully shuts.


## Approval Status
- v3 Approved: BudE404 confirmed Keep on Aug 19, 2026
- Gate lore enhanced and locked
- Total maps: 21 (20 campaign + 1 universal trial)
