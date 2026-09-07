// TRIBUTE METER — the persistent drop currency (canon law, BudE404 Sept 6:
// 'in-agree on the gear, the grind part sucks...'). NO drop RNG: tribute drops
// are OCCASIONAL, tied to notable kills (elites, first-clears, Warden Hollows,
// siege waves) — physical offerings to the god (tribute-reef lore). Spends at
// SHRINES via ShrineVendor. Power curve = trees + relic tiers + Mark choices,
// never drops. Doctrine: GDD sec 10.5 + PILGRIM-COMBAT-SYSTEM.

using UnityEngine;

public class TributeMeter : MonoBehaviour
{
    public static TributeMeter Instance { get; private set; }

    [Header("Notable-kill tribute (no RNG on trash kills)")]
    public int tribute = 0;
    public int eliteKillTribute = 25;
    public int wardenHollowTribute = 60;
    public int firstClearTribute = 40;
    public int siegeWaveTribute = 15;

    public System.Action<int> OnTributeChanged;

    void Awake() { if (Instance != null && Instance != this) { Destroy(gameObject); return; } Instance = this; }

    public void GainEliteKill() => Gain(eliteKillTribute);
    public void GainWardenHollowKill() => Gain(wardenHollowTribute);
    public void GainFirstClear() => Gain(firstClearTribute);
    public void GainSiegeWave() => Gain(siegeWaveTribute);

    void Gain(int amount)
    {
        tribute += amount;
        OnTributeChanged?.Invoke(tribute);
        // TODO (build pass): offering pickup visual — the drop reads as an object
        // left for the god (tribute-reef), motes are FAITH's visual; tribute has its own.
    }
}

// SHRINE VENDOR — tribute spends at shrines: class-tree nodes, relic tiers
// (Cold Lantern line), Mark re-attunement rites, cosmetic rune colorways.
// Zero randomness — the player chose everything they own.
public class ShrineVendor : MonoBehaviour
{
    public enum ShrineTier { ClassTree, RelicTier, MarkReattunement, Cosmetic }

    [System.Serializable]
    public class ShrineOffering
    {
        public string name;
        public ShrineTier tier;
        public int tributeCost;
        [TextArea] public string lore; // shrines speak — the offering names its own meaning
    }

    public ShrineOffering[] offerings;

    public bool TryPurchase(int index)
    {
        var o = offerings[index];
        if (TributeMeter.Instance == null || TributeMeter.Instance.tribute < o.tributeCost) return false;
        TributeMeter.Instance.tribute -= o.tributeCost;
        TributeMeter.Instance.OnTributeChanged?.Invoke(TributeMeter.Instance.tribute);
        // TODO (build pass): unlock callback into the class tree / relic / Mark systems
        return true;
    }
}

// HOLLOW ENEMY — shared with the god-scale staging scripts via IDamageable;
// pilgrim-scale combat needs the guard-break + revenant debt hooks.
public class HollowEnemy : MonoBehaviour
{
    [Header("Stats (per COMBAT balance doc)")]
    public float hp = 40f;
    public float power = 60f;
    public float accuracy = 40f;
    public float dodge = 20f;
    public float parry = 30f;

    [Header("Elite (Warden Hollow / guard slab)")]
    public bool isElite;
    public bool guardBroken;
    public float guardBreakWindow = 3.5f;

    [Header("Debt economy (canon): at threshold a Hollow REVENANTS — kill fast")]
    public float debt = 0f;
    public float revenantThreshold = 30f;

    public bool Dead { get; private set; }

    public void TakeHit(float damage, bool stagger, bool guardBreak, float multiplier = 1f)
    {
        if (Dead) return;
        if (isElite && !guardBroken && !guardBreak) { /* blows bounce off the void-iron slab */ debt += 1f; return; }
        if (isElite && guardBreak) StartCoroutine(GuardBreakWindowRoutine());

        hp -= damage * multiplier;
        debt += damage * 0.6f;

        if (debt >= revenantThreshold && !Dead) Revenant();

        if (hp <= 0f)
        {
            Dead = true;
            var faith = FaithMeter.Instance;
            if (faith != null) faith.GainKill(transform.position + Vector3.up * 1f);
            var tribute = TributeMeter.Instance;
            if (tribute != null)
            {
                if (isElite) tribute.GainWardenHollowKill();
                // trash kills drop NO tribute — only faith. Canon: no drop RNG.
            }
            Destroy(gameObject, 0.1f); // TODO (build pass): dissolve into motes, then destroy
        }
    }

    void Revenant()
    {
        // TODO (build pass): enraged visual + stat surge — the Hollow's debt comes due
    }

    System.Collections.IEnumerator GuardBreakWindowRoutine()
    {
        if (guardBroken) yield break;
        guardBroken = true;
        yield return new WaitForSeconds(guardBreakWindow);
        guardBroken = false;
    }
}
