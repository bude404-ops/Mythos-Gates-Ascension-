import json

oly = {"factionId": "MG-FACTION-003", "npc": "Lyrion Laurel-Envoy", "deity_voice": "Zeus Divine Voice", "chapters": {}, "elite_chapters": {}}

# Read the campaign lore to get chapter summaries
chapters_data = {
    "1": {"theme": "Laurel-Sky Threshold", "focus": "Trial reactivation. Excellence requires witness. First Hollow contact through corrupted trial remnants."},
    "2": {"theme": "Oracle Vapor Bleed", "focus": "Oracle corruption. Visions of failure. Hollow adaptation to tactics."},
    "3": {"theme": "The Banner That Should Not Exist", "focus": "Forgotten remnant. Cross-faction tension. Trial becomes legal proceeding."},
    "4": {"theme": "Thunder Tribunal Fracture", "focus": "Rule collision. Two legal systems. Choose which law to honor or break both."},
    "5": {"theme": "The Laurel-Sky Verdict", "focus": "Final trial. Gate as judge. Prove excellence has purpose beyond ego. Boss: Thunder Tribunal Usurper."}
}

# Generate unique dialogue for each chapter
for ch_num, ch_info in chapters_data.items():
    oly["chapters"][ch_num] = {
        "intro": [
            f"The Gate opens across high air. Marble platforms materialize. The old trial road activates for the first time since the Collapse. The Gate does not test strength. It tests whether your excellence still has witness." if ch_num == "1" else f"The trial road deepens. Chapter {ch_num}: {ch_info['theme']}. The Gate has learned from the previous chapters. The tests are sharper.",
            f"The {ch_info['theme']} activates. The Hollow has corrupted the trial mechanisms. What was once a test of excellence is now a test of survival.",
            f"The trial intensifies. The Gate is measuring not just your skill but your purpose. Every victory is weighed. Every failure is recorded.",
            f"The {ch_info['theme']} core. The Gate demands proof. {ch_info['focus']}"
        ],
        "enemy": [
            "Hollow-corrupted laurel champions wearing the shapes of forgotten victors. What remains is the form without the fire.",
            "The corrupted constructs adapt to your combat style. Each one you defeat teaches the next.",
            "The Hollow has spawned trial-wraiths. They do not fight. They testify against your excellence.",
            f"The {ch_info['theme']} guardian. It does not fight. It judges. And in the Laurel-Sky Gate, judgment has the weight of law."
        ],
        "mid": [
            "The trial road does not hate the unworthy. It refuses to pretend. Fight with purpose, not pride.",
            "The constructs are learning your patterns. Excellence is not repetition. It is evolution.",
            "The Hollow uses your own victories against you. Every excellence you demonstrate becomes a weapon it can copy.",
            "The guardian judges your flaws. Do not defend. Outperform the judgment. Excellence is the only valid answer."
        ],
        "victory": [
            f"The {ch_info['theme']} holds. The Gate recorded your excellence and your motives. The deeper trials will test both.",
            "The corrupted constructs are silent. But the Gate learned your approach. The next trial will counter it.",
            "You proved that excellence has purpose. But the Gate asks: purpose for what?",
            "The guardian is broken. Not by argument but by demonstration. But the deeper trials will demand more than demonstration."
        ],
        "defeat": [
            "The trial road does not close. It waits. Return when your excellence can survive being measured.",
            "The constructs adapted faster than you could evolve. Return when your excellence is invention, not repetition.",
            "The Hollow used your own excellence against you. Return when your purpose is stronger than your pride.",
            "The guardian judgment held. Return when excellence is its own answer, not its own defense."
        ],
        "codex": [
            f"The {ch_info['theme']} is a trial site. Every platform is a witness stand. Excellence without witness is just noise in marble armor.",
            f"The corrupted constructs are warnings. They were excellent once. The Gate consumed their excellence and left the form. {ch_info['focus']}",
            "The Hollow does not destroy excellence. It empties it. The form remains. The fire is gone. This is what awaits those who mistake excellence for purpose.",
            f"The {ch_info['theme']} teaches: excellence requires witness, but the witness must be purpose, not pride. Without purpose, excellence is just decoration."
        ]
    }

# Elite chapters
for ch_num in range(1, 6):
    ch_info = chapters_data[str(ch_num)]
    oly["elite_chapters"][str(ch_num)] = {
        "intro": [
            f"The Gate rebuilt the {ch_info['theme']}. The trials now target your Normal campaign excellence patterns. Every victory from before is a known pattern.",
            f"The oracle vapors show futures based on both campaigns. Your Normal victories are shown as future failures. Push through.",
            f"The Hollow compiled your Normal campaign data. Every excellence you demonstrated is now a counterable pattern.",
            f"The reforged guardian carries your Normal campaign verdict. It knows how you proved purpose and closed that argument."
        ],
        "enemy": [
            "Adapted trial constructs carrying your Normal campaign excellence data. They counter every approach that worked before.",
            "Oracle-bleed wraiths evolved from both campaigns showing futures where both victories lead to collapse.",
            "Hollow legal parasites with full campaign precedent using your own past victories as evidence of ego.",
            f"The reforged {ch_info['theme']} guardian. It consumed your Normal campaign proof of purpose. The old argument will not work twice."
        ],
        "mid": [
            "The constructs know your Normal campaign excellence. Demonstrate excellence you have never shown.",
            "The oracle shows both campaigns failures. Push through. The futures are incomplete, not inevitable.",
            "The parasites use your past victories as evidence of ego. Do not argue. Demonstrate new purpose.",
            "The guardian closed your old proof. Find a new way to prove purpose or fight without proof."
        ],
        "victory": [
            f"Chapter {ch_num} holds again but the Gate recorded this excellence too. You are building a second pattern.",
            "The constructs are broken. But the Gate now has two campaigns of your excellence data.",
            "The oracle visions are dispersed. But the Gate learned your relationship with failure from both campaigns.",
            "The guardian is silent to a new proof. But the Gate recorded this proof. Each victory narrows the arguments available to the next deity."
        ],
        "defeat": [
            "The constructs countered your Normal campaign excellence. Return when your excellence is invention, not repetition.",
            "The oracle consumed your confidence with visions from both campaigns. Return when you can see failure from two descents and still fight.",
            "The parasites argued you into irrelevance using both campaigns victories. Return when your purpose is beyond legal argument.",
            "The reforged guardian closed your old proof. Return when you can prove purpose without words."
        ],
        "codex": [
            f"The Elite {ch_info['theme']} stores excellence data across campaigns. Every Normal victory becomes an Elite counter-pattern.",
            "The Gate oracle now spans multiple campaigns. The deity relationship with failure is fully mapped.",
            "The Elite legal parasites use both campaigns victories as evidence. The Hollow strategy: weaponize success as ego.",
            "Each Elite victory teaches the Gate how to close the next deity arguments. Excellence is not a fixed state. It is an evolving practice."
        ]
    }

# Override Elite Ch5 with specific boss dialogue
oly["elite_chapters"]["5"] = {
    "intro": [
        "The Thunder Tribunal Usurper has been rebuilt with your Normal campaign verdict data. It knows how you proved purpose and consumed that proof. The old argument will not work.",
        "The Usurper is trying your excellence from both campaigns. Every victory, every failure, every moment of ego is weighed across two full descents.",
        "The Usurper has consumed all witnesses from both campaigns. No external testimony remains. You stand alone with two campaigns of evidence.",
        "The final Elite verdict. The Usurper demands proof that your excellence has purpose beyond ego across two full campaigns. Without proof, the verdict is absolute."
    ],
    "enemy": [
        "Elite Usurper. It consumed your Normal campaign proof and patched the argument. Purpose proven once is not purpose proven twice.",
        "The Usurper calls witnesses from both campaigns. Every enemy and ally from both descents. The trial spans your complete history.",
        "The Usurper consumed all witnesses. You are legally alone with two campaigns of evidence. Self-testimony is still invalid.",
        "The final Usurper. Both campaigns consumed. All proofs closed. It demands proof of purpose that transcends everything you have ever done."
    ],
    "mid": [
        "The Usurper closed your old proof. Find a new way to demonstrate purpose or let the action be the argument.",
        "The witnesses testify from both campaigns. Their testimony is true. Acknowledge it. Transcend it.",
        "You are alone. No witness from either campaign remains. But actions are testimony. Fight with purpose and the action testifies.",
        "The Usurper demands proof. Do not speak. Fight. Every strike that serves beyond ego across two campaigns is testimony it cannot consume."
    ],
    "victory": [
        "The Usurper falls again to a new proof. But the Gate recorded it. Each victory closes an argument for the next deity.",
        "The witnesses from both campaigns testified against you and you transcended both. Purpose is not about being right. It is about holding.",
        "The Usurper consumed all witnesses. But your actions testified. Two campaigns of excellence with purpose is its own witness.",
        "The Thunder Tribunal Usurper is defeated for the last time. The trial holds not because you were perfect across two campaigns, but because you were purposeful. Excellence with purpose is its own law."
    ],
    "defeat": [
        "The Usurper patched argument held. Your old proof is consumed. Find a new proof of purpose.",
        "The witnesses from both campaigns overwhelmed you. Two descents of failure is harder to transcend than one.",
        "The Usurper consumed all witnesses from both campaigns. Return when your actions are enough.",
        "The absolute verdict held. You could not prove purpose across two full campaigns. Return when purpose is not a proof but a practice."
    ],
    "codex": [
        "The Elite Usurper closes every proof from the Normal campaign. Purpose proven once is not purpose proven twice. The deity must find a new argument.",
        "The Elite trial spans both campaigns. Every enemy, every ally, every victory, every failure. The trial is about the complete record.",
        "The Elite Usurper consumes all witnesses from both campaigns. But the lesson holds: actions are testimony. Excellence with purpose provides its own witness across any number of campaigns.",
        "The Elite Final Verdict: excellence with purpose is legitimate across all campaigns. The Gate judges the complete record. And the complete record is purposeful not because every moment was perfect, but because the deity held purpose across all of them."
    ]
}

with open("olympian_dialogue.json", "w") as f:
    json.dump(oly, f, indent=2)
print("Olympian dialogue written")
