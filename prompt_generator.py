#!/usr/bin/env python3
"""
Mythos Gates — Premium Prompt Generator v2.0
Generates v18-quality art prompts for all 63 titans using:
- Deity data (mythology, gear, visual traits, DNA)
- Faction visual bible (realm, materials, colors, environment)
- Backstory (personality, function, conflict)
- Aten-Ra v18 approved prompt structure as the template

Output: Updated art/prompts/TG-PROMPT-XXX.json files with premium prompts
"""

import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def load_json(path):
    with open(path) as f:
        return json.load(f)

def load_titans():
    data = load_json(os.path.join(BASE, 'data', 'titans.json'))
    return data if isinstance(data, list) else [data]

def load_faction_bibles():
    data = load_json(os.path.join(BASE, 'data', 'faction-visual-bible.json'))
    entries = data.get('entries', data) if isinstance(data, dict) else data
    bibles = {}
    if isinstance(entries, list):
        for e in entries:
            bibles[e.get('factionId','')] = e
    return bibles

def load_backstory(titan_id):
    # Convert TG-TITAN-001 -> TG-BACKSTORY-TITAN-001
    num = titan_id.split('-')[-1]
    path = os.path.join(BASE, 'backstories', 'titans', f'TG-BACKSTORY-TITAN-{num}.json')
    try:
        return load_json(path)
    except:
        return {}

def format_list(items, sep='; '):
    return sep.join(items) if isinstance(items, list) else str(items)

def get_faction_name(faction_id):
    names = {
        'TG-FACTION-001': 'Aten Ra',
        'TG-FACTION-002': 'Asgardian', 
        'TG-FACTION-003': 'Olympian',
        'TG-FACTION-004': 'Kami',
        'TG-FACTION-005': 'Tuatha',
        'TG-FACTION-006': 'Empyrean',
        'TG-FACTION-007': 'Infernal Dominion'
    }
    return names.get(faction_id, 'Unknown')

def get_realm_name(faction_id, bibles):
    b = bibles.get(faction_id, {})
    return b.get('realm', 'Unknown Realm')

# === MYTHOLOGY DEEP DIVE SECTION ===
# Maps each titan to their mythological sources with anatomy integration

MYTH_DEEP_DIVES = {
    # === ATEN RA FACTION ===
    "Aten Ra": {
        "sources": [
            {
                "name": "RA — The Noon Sun, King of Gods, Falcon-Headed Creator",
                "anatomy": "Ancient humans saw his raptor-like cranial structure and copied it as a falcon head. His actual face is NOT human: the brow ridge is a falcon's brow — heavy, predatory, sweeping back into the skull. His eyes are NOT human eyes — they are BURNING SOLAR DISCS set into the sockets, gold-white with black pupils containing swirling coronas. The Uraeus cobra humans put on pharaohs' brows is NOT a decoration — it is a LIVING DIVINE ORGAN growing from his forehead, a golden serpent-coil of protective energy embedded in his skull."
            },
            {
                "name": "ATEN — The Radiating Sun Disc, Life-Giving Hand-Rays",
                "anatomy": "Aten was deliberately non-anthropomorphic in Egyptian art. His body reflects that: golden LIGHT-HANDS extend from his shoulders and spine — radiant extensions of solar energy shaped like open hands. His skin is NOT human skin — it is TRANSLUCENT OBSIDIAN GLASS filled with golden solar light. Where it cracks, raw white-gold light bleeds through. His chest does not wear a wesekh collar — the collar IS his chest, layers of electrum and faience fused to his ribcage as living armor."
            },
            {
                "name": "MA'AT — Truth, Balance, Cosmic Order, Feather of Judgment",
                "anatomy": "The ostrich feather of Ma'at is NOT on his head — it is a LIVING ORGAN embedded in his spine, visible as a feather-shaped energy pattern running down his back, glowing through translucent skin. The Weighing Scales are not a tool he carries — they are his SHOULDERS, with a visible energy-bridge of balance that measures the battlefield."
            }
        ]
    },
    "Khemet": {
        "sources": [
            {
                "name": "KHEPRI — The Scarab God, Dawn Rolling, Renewal Through Dark Passage",
                "anatomy": "Ancient humans saw the scarab carapace fused to his upper body and copied it as a beetle-headed god. His actual anatomy has a SOLAR SCARAB CARAPACE growing from his shoulders — a living shell of faience and amber that stores dawn-energy. His face emerges FROM the carapace, not behind it: the carapace IS his upper anatomy. His eyes are GENERATOR EYES — twin amber crystals that glow with stored solar renewal, not biological organs."
            },
            {
                "name": "DAWN RENEWAL — The Cycle of Light Returning",
                "anatomy": "His body is a RENEWAL ENGINE — the dark half of the solar cycle made flesh. His skin shifts between obsidian-dark (the night passage) and amber-gold (the dawn return), with the boundary line visible as a living horizon across his torso. His arms are BARQUE-SHAPED — curved like the solar barque that carries the sun through the underworld, rowed by stored dawn-energy."
            },
            {
                "name": "SCARAB PUSH — The Rolling Force That Moves the Sun",
                "anatomy": "His legs are ROOTED like the scarab's legs — wide, braced, built to push. His feet merge with the ground through amber energy tendrils. He does not walk — he PUSHES through the battlefield like Khepri pushes the sun. His core is a GLOWING AMBER GENERATOR visible through translucent skin, pulsing with stored renewal energy."
            }
        ]
    },
    "Nefra": {
        "sources": [
            {
                "name": "NEPHTHYS — Lady of the House, Keeper of the Hidden Duat",
                "anatomy": "Ancient humans saw her obsidian-dark skin and copied it as a death goddess. Her skin is NOT dark pigment — it is TRANSLUCENT OBSIDIAN that absorbs light rather than reflecting it. She is the dark side of the solar cycle: where Aten-Ra radiates, Nefra RECEIVES. Her body is a LIVING THRESHOLD — the boundary between day and night made flesh."
            },
            {
                "name": "DUAT GATE — The Hidden Realm Between Death and Dawn",
                "anatomy": "Her arms are THRESHOLD-SHAPED — they form the pylons of a gate when raised. Her hands are NOT hands — they are OBSIDIAN MIRRORS that reflect what is hidden. Her eyes are HORIZON EYES — one amber (dawn), one obsidian (dusk), each seeing a different side of reality. The linen wrapping humans saw on mummies is NOT burial cloth — it is LIVING THRESHOLD ENERGY that flows from her body."
            },
            {
                "name": "GUARDIAN OF TRANSITION — She Who Stands at the Gate",
                "anatomy": "Her crown is NOT a hat — broken obsidian prongs emerge FROM HER SKULL, forming the silhouette of a gate. She does not stand ON the ground — the ground OPENS around her feet, the realm responding to her threshold nature. Her body absorbs the light around her, creating a visible aura of controlled darkness."
            }
        ]
    },
    "Orru": {
        "sources": [
            {
                "name": "MA'AT WEIGHING — The Punishment Side of the Balance",
                "anatomy": "Ancient humans saw his prism-splitting anatomy and copied it as the weighing of the heart ceremony. His body IS the punishment scale — not a tool he carries, but LIVING JUDGMENT ANATOMY. His chest is a CRYSTALLINE SOLAR PRISM embedded in his ribcage, a living crystal that refracts hidden weight into visible judgment light. His skin is TRANSLUCENT AMBER with lapis shadow seams that pulse when judgment is near."
            },
            {
                "name": "PRISM LIGHT — The Refraction of Hidden Truth",
                "anatomy": "His eyes are NOT eyes — they are AMBER VERDICT LENSES that refract light like a prism, splitting truth from lies visually. His forehead has a PRISM-SPLIT BROW RIDGE — a crystalline ridge that literally splits light into a spectrum across his face. When he looks at something, the light around it refracts, revealing its true weight. His jaw has the VERDICT-SCALE JAW LINE — so clean and precise it looks carved from divine law itself."
            },
            {
                "name": "DIVINE VERDICT — The Execution of Judgment",
                "anatomy": "His shoulders are formed from REFRACTED PRISM SHARDS — jagged crystalline formations that grow upward from his deltoids like shattered amber glass. The LEFT shoulder has a single massive facet that acts as a light-prism, while the RIGHT shoulder has smaller clustered shards. Each shard catches and splits light into rainbow verdict-colors. This design is completely unique to Orru — no other titan has prism-shard shoulders. His forearms carry CLEAR AMBER GLASS BLADES — execution instruments that grow from his arms like bones."
            }
        ]
    },
    "Sutekh": {
        "sources": [
            {
                "name": "SET/SUTEKH — The Desert Storm, Red Lord of Chaos Harnessed",
                "anatomy": "Ancient humans saw his storm-wracked body and copied it as a chaos god. His body IS the desert storm — his skin is NOT skin but LIVING STORM-SCARRED SANDSTONE, cracked with red desert jasper veins that pulse with storm energy. His face has a SUTEKH SNUT — the distinctive squared, animal-like muzzle that humans copied as the Set animal head. It is NOT an animal mask — it is his actual cranial structure, divine anatomy that predates any animal."
            },
            {
                "name": "DESERT STORM — The Red Land's Necessary Violence",
                "anatomy": "His arms are STORM PILLARS — massive, rectangular, pylon-like limbs that channel desert storm force. His shoulders carry STORM-STEEL SHARD PLATES — angular, aggressive plates that look like they were forged in a sandstorm, completely different from Orru's prism shards. His eyes are STORM EYES — red-gold irises that flicker like lightning within."
            },
            {
                "name": "NECESSARY DEFENSE — The Storm That Guards Ra From Chaos",
                "anatomy": "His core is a CHAOS CORE — a swirling vortex of red-gold storm energy visible through his armored chest. His legs are DESERT-ROOTED — wide, braced, with storm-sand swirling around his feet. He does not merely stand — he generates the atmospheric pressure of a coming storm."
            }
        ]
    },
    "Iset": {
        "sources": [
            {
                "name": "ISIS/ISET — Throne Magic, Restoration, The Queen Who Reassembles",
                "anatomy": "Ancient humans saw the throne-fused structure of her body and copied it as Isis the throne goddess. Her body IS the throne — not sitting on one, but GROWN FROM ONE. Her back is a LIVING THRONE BACKREST, her shoulders carry THRONE-WING extensions of faience and lapis, and her hips are anchored by a THRONE BASE that fuses with her legs. Her skin is TRANSLUCENT LAPIS with golden restoration energy flowing through visible channels."
            },
            {
                "name": "RESTORATION MAGIC — The Power to Reassemble What Was Broken",
                "anatomy": "Her hands are NOT hands — they are RESTORATION TENDRILS, fingers of golden energy that knit broken things back together. Her eyes are HEALING EYES — warm amber that sees what is broken and knows how to fix it. Her core is a RESTORATION CORE — a glowing golden nexus visible through translucent lapis skin, pulsing with the power to rebuild."
            },
            {
                "name": "THRONE SOVEREIGNTY — The Seat of Power Made Flesh",
                "anatomy": "Her crown is NOT a hat — the throne-backrest rises from her spine and skull, forming a living crown of throne geometry. Her body radiates restoration energy that heals allies near her. She does not walk — the throne-base slides on restoration energy, the realm rearranging itself around her presence."
            }
        ]
    },
    "Karnu": {
        "sources": [
            {
                "name": "SOLAR BARQUE — The Mandjet, Day Vessel of the Sun",
                "anatomy": "Ancient humans saw the barque-hull curvature of his torso and copied it as the solar barque of Ra. His body IS the barque — his chest and torso are curved like a HULL, built to carry solar energy across the battlefield. His arms are OAR-ARMS — long, sweeping limbs that row through the air, propelling stored solar force. His skin is SUN-BRONZE with amber energy flowing through hull-channels."
            },
            {
                "name": "DAY JOURNEY — The Sun's Path Across the Sky",
                "anatomy": "His eyes are HORIZON-SCAN EYES — gold-amber lenses that see the full battlefield like Ra sees the full sky. His shoulders carry BARQUE-ARC PLATES — curved, hull-shaped pauldrons that channel solar energy forward. His core is a SOLAR ENGINE — the Mandjet's power source made flesh, glowing white-gold through his chest."
            },
            {
                "name": "CROSSING POWER — The Force That Moves the Sun Itself",
                "anatomy": "His legs are KEEL-LEGS — straight, hull-shaped, providing the stable base of a vessel. His feet leave solar-wake energy in the ground behind him. His weapon-arm carries a BARQUE-HOOK — a solar oar reforged as a weapon, curved like the steering oar of the sun-ship."
            }
        ]
    },
    "Maahes": {
        "sources": [
            {
                "name": "MAAHES — The Lion Guardian, Devourer of Captives at the Gate",
                "anatomy": "Ancient humans saw his lion-like cranial structure and copied it as a lion-headed god. His actual face is NOT a lion mask — it is DIVINE LION ANATOMY: a heavy, predatory brow ridge, broad nasal structure, and a MANE OF LIVING SOLAR ENERGY that radiates from his skull like a corona. His jaw is LEONINE — broad, powerful, built to crush. His eyes are PREDATOR EYES — amber-gold with vertical pupils that track movement."
            },
            {
                "name": "LION GUARDIANSHIP — The Roar That Protects the Gate",
                "anatomy": "His body is LION-FORGED — desert-lean muscle visible beneath bronze skin, built for explosive guard duty. His shoulders carry MANE-PLATES — curved pauldrons that echo the lion's mane, made of solar-charged bronze. His chest is a GUARDIAN CHEST — broad, shield-like, with a lion-emblem core that pulses with protective energy."
            },
            {
                "name": "GATE ROAR — The Sound That Tells Everything on the Wrong Side",
                "anatomy": "His throat is a ROAR-ENGINE — visible energy channels in his neck that amplify sound into divine force. His arms are PAW-FORGED — heavy, broad-handed, built for crushing guard-blows. His legs are LION-LEGS — coiled, ready to spring, with desert-jasper energy crackling at his feet."
            }
        ]
    },
    "Amunet": {
        "sources": [
            {
                "name": "AMUNET — The Hidden One, Concealed Power Behind the Name",
                "anatomy": "Ancient humans saw her half-visible, half-concealed body and copied it as a hidden goddess. Her body is NOT fully visible — she exists in a state of DIVINE CONCEALMENT: parts of her anatomy phase between visible (amber-gold) and invisible (obsidian void). Her skin flickers between solid and translucent, as if she is only partially manifest. Her eyes are HIDDEN EYES — they appear and disappear, seeing through concealment."
            },
            {
                "name": "CONCEALMENT POWER — The Breath Behind the Name",
                "anatomy": "Her arms are WRAITH-ARMS — limbs that phase between solid bronze and obsidian shadow, striking from concealment. Her shoulders carry VEIL-PLATES — armor that shimmers between visible and invisible, never fully solid. Her core is a HIDDEN CORE — visible only as a pulsing absence, a void that radiates concealed power."
            },
            {
                "name": "HIDDEN EXECUTION — The Strike From Nowhere",
                "anatomy": "Her crown is NOT visible — it exists as a CONCEALMENT CORONA, an outline of power that flickers above her head. Her legs phase between solid and void, making her movement unpredictable. She does not walk — she APPEARS, as if stepping out of concealment with each stride."
            }
        ]
    },
    
    # === ASGARDIAN FACTION ===
    "Allfather": {
        "sources": [
            {
                "name": "ODIN — The All-Father, Sovereign Who Traded an Eye for Wisdom",
                "anatomy": "Ancient humans saw his single burning eye and copied it as a one-eyed god. His face is NOT human: one eye is a BURNING RUNE-LENS — a divine optical organ that sees across all battlefield timelines. The OTHER eye socket is SEALED with living obsidian — not an empty wound, but a SCAR THAT SEES DIFFERENTLY, showing him what the rune-lens cannot. His brow is HEAVY, predatory, crowned by BROKEN HORN-PRONGS that grow from his skull, not worn."
            },
            {
                "name": "RAVENS — Huginn and Muninn, Thought and Memory",
                "anatomy": "The ravens humans saw are NOT pets — they are LIVING DIVINE EXTENSIONS of his consciousness, perched on his shoulders as THOUGHT-CROWS made of storm-shadow and rune-light. They are part of his anatomy, growing from his shoulder-armor like living ornaments. When they spread their wings, they extend his battlefield awareness."
            },
            {
                "name": "SOVEREIGN STORM — The Oath-Binder, War-King of the Aesir",
                "anatomy": "His body is STORM-FORGED — dark rune-iron skin with oath-red wax veins that pulse with binding power. His shoulders carry OATH-STONE PAULDRONS — massive, rectangular, carved with rune-glyphs that glow when oaths are spoken. His chest is a RUNE-CHEST — visible oath-glyphs carved into his sternum, glowing through translucent iron skin."
            }
        ]
    },
    "Hrothar": {
        "sources": [
            {
                "name": "FREYJA/VALKYRIES — The Chooser of the Slain, Battle-Fate Weaver",
                "anatomy": "Ancient humans saw her battle-fate sight and copied it as a goddess who chose the slain. Her body IS the choosing mechanism — her eyes are FATE-WEIGHT EYES that read the worth of every warrior on the battlefield, glowing with the amber-gold of stored battle-fate. Her skin is TRANSLUCENT STORM-STEEL with fae-glass veins that pulse with harvested fate-energy."
            },
            {
                "name": "BATTLE-FATE — The Renewal Engine That Converts Combat to Power",
                "anatomy": "Her shoulders carry VALKYRIE-WING PLATES — not feathered wings, but BLADE-WING pauldrons shaped like Valkyrie wings, made of rune-iron and storm-steel. Her core is a FATE-GENERATOR — a visible vortex of amber fate-energy that stores the sacred force of every fallen warrior, glowing through her chest."
            },
            {
                "name": "SACRED FORCE — The Power Harvested From Battle",
                "anatomy": "Her arms are FATE-GATHERING ARMS — long limbs that reach across the battlefield to harvest fate-energy from falling warriors. Her legs are ROOTED in storm-iron, with oath-red energy channels running to the ground. She does not walk — she ARRIVES, fate-energy announcing her presence."
            }
        ]
    },
    "Skeld": {
        "sources": [
            {
                "name": "YGGDRASIL — The World Tree, Root Architecture of the Nine Worlds",
                "anatomy": "Ancient humans saw the root-structure growing through his body and copied it as a world tree. His body IS the root system — WORLD-ROOT VEINS run through his skin, visible as glowing green-gold channels that connect to the terrain itself. His skin is BARK-IRON — dark, textured like living ash-wood fused with storm-steel, clearly not human."
            },
            {
                "name": "NINE-WORLD CROSSINGS — Root-Engineered Gateways",
                "anatomy": "His shoulders carry ROOT-NODE PAULDRONS — growths of living ash-wood and iron that pulse with the energy of the Nine Worlds. His core is a ROOT-HEART — a visible nexus of root-energy that connects him to the battlefield terrain. His eyes are ROOT-SIGHT EYES — deep green-gold that sees the root-structure beneath any surface."
            },
            {
                "name": "TERRAIN CONTROL — The Power to Bend the Battlefield",
                "anatomy": "His arms are ROOT-EXTENSIONS — limbs that end in root-iron claws, capable of extending into the ground. His legs are TRUNK-LEGS — massive, bark-covered, planted like tree-roots. The ground around him responds — roots grow, walls rise, terrain bends to his will."
            }
        ]
    },
    "Eirwyn": {
        "sources": [
            {
                "name": "VALHALLA/ EINHERJAR — The Honored Dead, Death as Transformation",
                "anatomy": "Ancient humans saw her death-transformation anatomy and copied it as Valhalla's feast. Her body IS the threshold between combat and transcendence — her skin is TRANSLUCENT STORM-STEEL with the faces of honored dead visible beneath the surface, faint amber outlines of warriors she has chosen. Her eyes are FEAST-EYES — burning with the accumulated glory of every warrior she has transformed."
            },
            {
                "name": "BREAKER OF FALSE SANCTUARY — The Test of What Is Real",
                "anatomy": "Her shoulders carry SHATTER-PLATES — angular, fractured pauldrons that look like they have been broken and reforged, each crack glowing with oath-red energy. Her core is a VERDICT-CORE — a visible nexus of judgment that tests whether what it touches is real or false, glowing through her chest."
            },
            {
                "name": "DEATH-AS-FEAST — The Living Principle That Makes Combat Meaningful",
                "anatomy": "Her arms are CRUSHER-ARMS — massive, built for the war-judge maul she carries, with storm-steel muscle and bone-white knuckle-plates. Her legs are DEATH-ANCHORED — planted with the weight of every warrior she has sent to the feast. She does not advance — she TESTS, each step a judgment."
            }
        ]
    },
    "Mordun": {
        "sources": [
            {
                "name": "RAGNAROK/FENRIR — The Wolf at the End, Necessary Doom",
                "anatomy": "Ancient humans saw the doom-pressure building in his body and copied it as a world-ending wolf. His face is NOT human — it has WOLF-JAW ANATOMY: a heavy, lupine muzzle structure that is his actual cranial bone, not a mask. His eyes are DOOM EYES — black-gold with the cold of Fimbulwinter, seeing the end approaching. His skin is FROST-IRON — dark, cold-storm-steel with white-frost veins that pulse with doom-pressure."
            },
            {
                "name": "FIMBULWINTER — The Long Cold Before the End",
                "anatomy": "His shoulders carry WOLF-MANE PLATES — spiked, frost-covered pauldrons that echo the wolf's mane, made of blackwinter-frost and storm-iron. His core is a DOOM-CORE — a visible vortex of cold destruction energy that builds pressure with every heartbeat, frost spreading from his chest."
            },
            {
                "name": "NECESSARY CHAOS — The Ending That Makes Survival Possible",
                "anatomy": "His arms are WOLF-CLAW ARMS — heavy, clawed, built for the frost-anvil sceptre. His legs are FROST-ROOTED — blackwinter-frost spreading from his feet across the ground. The air around him drops in temperature; frost forms on everything near him."
            }
        ]
    },
    "Veyra": {
        "sources": [
            {
                "name": "AESIR-VANIR EXCHANGE — The Hostage Memory, Enemies to Family",
                "anatomy": "Ancient humans saw the restoration-ties woven through her body and copied them as Vanir gods. Her body IS the living treaty — RESTORATION-THREADS run through her skin, visible as glowing green-gold channels that connect to nearby allies. Her skin is TRANSLUCENT STORM-SILK with fae-glass restoration energy flowing beneath."
            },
            {
                "name": "THUNDERLOOM — The Weaving of Oath-Ties",
                "anatomy": "Her shoulders carry LOOM-PLATES — pauldrons shaped like a warp-weighted loom, with threads of restoration energy hanging between them. Her core is a WEAVE-HEART — a visible nexus of woven oath-ties that pulses with green-gold restoration energy. Her eyes are WEAVER EYES — green-gold that sees the threads connecting every being."
            },
            {
                "name": "RESTORATION RITE — The Power to Re-Weave What Was Severed",
                "anatomy": "Her arms are WEAVE-ARMS — long, precise, ending in fingers that trail restoration-thread energy. Her legs are ROOTED in oath-stones, the ground bearing rune-glyphs around her feet. She does not fight — she MENDS, and the mending is her weapon."
            }
        ]
    },
    "Ragnor": {
        "sources": [
            {
                "name": "JOTNAR — Frost Giants, Primal Mountain Opposition",
                "anatomy": "Ancient humans saw his mountain-scale body and copied it as frost giants. His body IS the mountain — his skin is LIVING FROST-GRANITE, dark stone with blue-frost veins that pulse with Jotnar cold. His proportions are TOO LARGE for a human — he is built at a scale that makes other titans look small, his frame broad and mountain-heavy."
            },
            {
                "name": "FROST-SUMMIT STRIKE — The Artillery from the Peak",
                "anatomy": "His shoulders carry BOULDER-PAULDRONS — massive, granite-shaped plates that look like they were carved from a mountain peak. His core is a FROST-CORE — a visible nexus of Jotnar-scale cold energy, blue-white frost radiating from his chest. His eyes are SUMMIT EYES — distant, cold, seeing across the entire battlefield from elevation."
            },
            {
                "name": "HORIZON PRESSURE — The Force of the Necessary Opposite",
                "anatomy": "His arms are BOULDER-ARMS — massive, granite-forged, built for the frost-summit lance. His legs are MOUNTAIN-ROOTED — planted with the weight of a geological formation. He does not move quickly — he ARRIVES, and the ground trembles."
            }
        ]
    },
    "Ullr": {
        "sources": [
            {
                "name": "ULLR — The Archer God, Snow-Crown Threshold Guardian",
                "anatomy": "Ancient humans saw his snow-anchored body and copied it as an archer god of the hunt. His body IS the threshold — his skin is FROST-STEEL with bone-white snow-energy flowing through visible channels. His eyes are THRESHOLD EYES — one amber (the gate), one bone-white (the snow-line), each watching a different boundary."
            },
            {
                "name": "SNOW-CROWN GUARDIAN — The One Who Never Leaves His Post",
                "anatomy": "His shoulders carry SNOW-CROWN PAULDRONS — curved, bone-white plates that echo the snow-line, with frost-energy radiating upward. His core is a GUARDIAN-CORE — a steady, unwavering nexus of oath-energy that pulses with the rhythm of a sentinel's watch."
            },
            {
                "name": "THRESHOLD-BOW — The Arrow That Never Misses What Crosses",
                "anatomy": "His arms are ARCHER-ARMS — long, precise, built for the threshold-bow. His legs are SNOW-ANCHORED — frost spreading from his feet, marking his territory. He does not pursue — he HOLDS, and whatever crosses his line is already hit."
            }
        ]
    },
    "Sigrun": {
        "sources": [
            {
                "name": "SIGRUN — The Valkyrie Who Defied Fate, Silent Execution",
                "anatomy": "Ancient humans saw her thunder-concealed body and copied it as a Valkyrie who defied death. Her body IS the hidden verdict — her skin is STORM-SHADOW, translucent dark-steel that flickers between visible and invisible with the rhythm of thunder. Her eyes are VERDICT EYES — amber-gold that see through armor and lies, glowing only at the moment of judgment."
            },
            {
                "name": "THUNDER CONCEALMENT — Moving Through Storm-Noise",
                "anatomy": "Her shoulders carry BLADE-WING PAULDRONS — angular, blade-shaped plates that channel thunder into concealment. Her core is a SILENT-CORE — a void of energy that absorbs sound and light around her, making her presence undetectable until she strikes."
            },
            {
                "name": "OATH-FLARE DAGGERS — The Hidden Verdict Made Manifest",
                "anatomy": "Her arms are BLADE-ARMS — lean, fast, ending in hands that hold oath-flare daggers. Her legs are THUNDER-LEGS — moving with the speed of lightning, silent despite their power. She does not announce herself — she IS the announcement, arriving as the verdict."
            }
        ]
    },
}

# Placeholder for remaining factions — will be filled from titan data
# For titans not in MYTH_DEEP_DIVES, generate from their data fields

def generate_myth_section(titan, bibles):
    """Generate the mythology deep-dive section for a titan."""
    name = titan.get('name', '')
    
    if name in MYTH_DEEP_DIVES:
        sources = MYTH_DEEP_DIVES[name]['sources']
        lines = []
        lines.append(f"MYTHOLOGICAL SOURCES — deeply integrated into anatomy, not worn as accessories:\n")
        for i, src in enumerate(sources, 1):
            lines.append(f"{i}. {src['name']}\n   - {src['anatomy']}")
        return '\n'.join(lines)
    
    # Fallback: generate from titan data
    myth_source = titan.get('mythicSource', '')
    lore = titan.get('lore', '')
    visual = titan.get('visualDescription', '')
    
    return f"""MYTHOLOGICAL SOURCE — deeply integrated into anatomy, not worn as accessories:

1. {myth_source}
   - {lore} This is not a costume or decoration — it is LIVING DIVINE ANATOMY. His/her body IS the manifestation of this mythological function. Ancient humans saw this being through the Mythos Gate and copied what they saw as myth, but the Deity is the SOURCE, not the copy.

2. REALM ANATOMY
   - {titan.get('titanArtDna',{}).get('realmAnatomy','')} These are NOT biological features — they are DIVINE PHYSIOLOGY grown from the realm itself. The skin is not skin but living divine material. The veins are not veins but energy channels.

3. VISUAL IDENTITY
   - {visual} Every element must feel like it GREW from the divine body, not like it was PUT ON."""

def generate_non_human_section(titan, bibles):
    """Generate the non-human anatomy section."""
    art_dna = titan.get('titanArtDna', {})
    name = titan.get('name', '')
    sex = titan.get('sex', 'Male')
    
    face = art_dna.get('identityFace', '')
    body = art_dna.get('identityBody', '')
    realm_anatomy = art_dna.get('realmAnatomy', '')
    
    return f"""NON-HUMAN ANATOMY — This being is unmistakably NOT human:
- Proportions are WRONG for a human: too tall, too precise, built at COLOSSAL scale. The camera looks UP at him/her. This is a DIVINE BEING that ancient humans tried to remember as a person.
- Skin is clearly not human: {realm_anatomy}. It has a mineral, divine quality — energy patterns show THROUGH the skin as glowing channels, not painted on the surface.
- Face: {face} A human could never wear this face — it is too clean, too precise, too symmetrical, as if carved from divine law.
- Body: {body} The proportions read as DIVINE, not mortal.
- Bare head — NO halo rings, NO discs, NO circles behind or around the head. The head is completely bare.
- Every element of the body must feel like it GREW from divine anatomy, not like it was PUT ON as costume."""

def generate_weapon_section(titan):
    """Generate the weapon section."""
    weapon = titan.get('weaponCanon', '')
    gear = titan.get('gearCanon', {})
    weapon_name = gear.get('weapon', '')
    
    return f"""WEAPON: {weapon}
The weapon is made of the same divine material as the body — it looks like an EXTENSION of the titan, not a separate object. It is held with deliberate purpose, not generic combat posing. The weapon's silhouette must be unique to this titan and not shared by any other."""

def generate_armor_section(titan):
    """Generate the armor section."""
    armor = titan.get('armorCanon', '')
    art_dna = titan.get('titanArtDna', {})
    armor_identity = art_dna.get('armorIdentity', '')
    
    return f"""ARMOR (grown from divine body, not worn): {armor}
{armor_identity}
Everything is BIOLOGY, not costume. Every plate, inlay, and marking must have a mythological reason for existing. No generic plate armor, no interchangeable faction gear."""

def generate_materials_section(titan, faction_id, bibles):
    """Generate the materials section from faction visual bible."""
    fb = bibles.get(faction_id, {})
    materials = fb.get('materialHierarchy', [])
    colors = fb.get('colorPalette', [])
    
    mat_text = '; '.join(materials) if isinstance(materials, list) else str(materials)
    color_text = ', '.join(colors) if isinstance(colors, list) else str(colors)
    
    return f"""MATERIALS (grown from divine body, not worn): {mat_text}
COLOR PALETTE: {color_text}
Everything is BIOLOGY, not costume. Materials pulse with living energy — this is divine anatomy, not metalworked armor."""

def generate_pose_section(titan):
    """Generate the pose section."""
    personality = titan.get('personality', '')
    role = titan.get('role', '')
    
    return f"""POSE: Three-quarter hero stance, face clearly visible, weapon clearly visible. {personality} shown through expression and gesture. Premium playable character presentation saying "this is a GOD you can unlock and command." The pose expresses the {role} role through readable tactical intent, not generic action posing."""

def generate_silhouette_section(titan):
    """Generate the silhouette section."""
    art_dna = titan.get('titanArtDna', {})
    silhouette = art_dna.get('roleSilhouette', '')
    visual_traits = titan.get('visualTraits', [])
    
    traits_text = ', '.join(visual_traits) if isinstance(visual_traits, list) else str(visual_traits)
    
    return f"""SILHOUETTE: {silhouette} The silhouette reads as a COLOSSAL DIVINE BEING, not a human warrior. Even in pure black silhouette, no one would mistake this for a human. Key silhouette markers: {traits_text}."""

def generate_environment_section(titan, faction_id, bibles):
    """Generate the environment section from faction visual bible."""
    fb = bibles.get(faction_id, {})
    realm = fb.get('realm', '')
    env_rules = fb.get('environmentRules', [])
    avoid = fb.get('avoid', [])
    
    env_text = '; '.join(env_rules[:2]) if isinstance(env_rules, list) else str(env_rules)
    avoid_text = ', '.join(avoid[:8]) if isinstance(avoid, list) else str(avoid)
    
    return f"""ENVIRONMENT: {realm} — extradimensional divine realm. {env_text} Cinematic lighting. Readable full-body focus. No clutter.

ART STYLE: Premium stylized-realistic 3D mythological fantasy character. NOT anime, NOT manga, NOT chibi, NOT photoreal, NOT generic AI fantasy, NOT sci-fi. This is a GOD — the first thing the viewer sees must be "that is NOT a human, that is a divine being." Living divine anatomy, not robotic, not blocky architecture. The non-human nature is the PRIMARY design directive, not an afterthought. AAA-quality game character concept for a premium mobile tactical RPG.

AVOID: {avoid_text}."""

def generate_prompt(titan, bibles):
    """Generate a full v18-quality prompt for a single titan."""
    name = titan.get('name', '')
    faction = titan.get('faction', '')
    faction_id = titan.get('factionId', '')
    sex = titan.get('sex', 'Male')
    role = titan.get('role', '')
    realm = get_realm_name(faction_id, bibles)
    backstory = load_backstory(titan.get('id', ''))
    
    # Build the prompt
    sections = []
    
    # Opening
    pronoun = 'he' if sex == 'Male' else 'she'
    possessive = 'his' if sex == 'Male' else 'her'
    sections.append(f"""Create THIS specific legendary playable GOD — not a human, not a human in costume, not a powerful human. This is an EXTRADIMENSIONAL DIVINE BEING whose body IS the manifestation of ancient {faction.lower()} law. Ancient humans saw {name} dimly and tried to copy what they saw as myth — {name} is the SOURCE, not the copy.

GOD: {name}. {sex}. Faction: {faction}. Realm: {realm}. Role: {role}.""")
    
    # Mythology deep dive
    sections.append(generate_myth_section(titan, bibles))
    
    # Non-human anatomy
    sections.append(generate_non_human_section(titan, bibles))
    
    # Weapon
    sections.append(generate_weapon_section(titan))
    
    # Armor
    sections.append(generate_armor_section(titan))
    
    # Materials
    sections.append(generate_materials_section(titan, faction_id, bibles))
    
    # Pose
    sections.append(generate_pose_section(titan))
    
    # Silhouette
    sections.append(generate_silhouette_section(titan))
    
    # Environment + Art Style
    sections.append(generate_environment_section(titan, faction_id, bibles))
    
    return '\n\n'.join(sections)

def main():
    titans = load_titans()
    bibles = load_faction_bibles()
    
    print(f"Loaded {len(titans)} titans and {len(bibles)} faction bibles")
    
    updated = 0
    for titan in titans:
        titan_id = titan.get('id', '')
        name = titan.get('name', '')
        
        prompt = generate_prompt(titan, bibles)
        
        # Update the art prompt file
        num = titan_id.split('-')[-1]
        prompt_path = os.path.join(BASE, 'art', 'prompts', f'TG-PROMPT-{num}.json')
        
        if os.path.exists(prompt_path):
            with open(prompt_path) as f:
                d = json.load(f)
            old_len = len(d.get('prompt', ''))
            d['prompt'] = prompt
            d['promptVersion'] = 'v2.0'
            d['promptQuality'] = 'v18-matched'
            d['updated'] = '2026-08-18T02:30:00Z'
            with open(prompt_path, 'w') as f:
                json.dump(d, f, indent=2, ensure_ascii=False)
            updated += 1
            print(f"  {name}: {old_len} -> {len(prompt)} chars")
        else:
            print(f"  {name}: PROMPT FILE MISSING")
    
    print(f"\nUpdated {updated}/{len(titans)} titan prompts")

if __name__ == '__main__':
    main()
