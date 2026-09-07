// FAITH METER — THE MACER'S LOOP (canon law v2, BudE404: 'instead of mana we just
// have faith and abilities use faith and attacking and killing builds it back up').
// FAITH is the ONLY resource: NO mana, NO passive regen. Landed hits BUILD faith,
// kills BUILD it bigger (mote burst to the Luminary), the WARD converts caught damage
// INTO faith, abilities SPEND it. Cooldowns stay SHORT (TEMPO shrinks); the faith cost
// is the real gate. Doctrine: docs/design/PILGRIM-COMBAT-SYSTEM.md.

using UnityEngine;
using System.Collections.Generic;

public class FaithMeter : MonoBehaviour
{
    public static FaithMeter Instance { get; private set; }

    [Header("The Loop")]
    public float faith = 0f;
    public float maxFaith = 100f;

    [Header("Builders (the masher's engine)")]
    public float faithPerHit = 4f;        // every landed hit feeds the flame
    public float faithPerKill = 14f;     // kill-burst — chaining packs keeps the bar full
    public float faithPerParryCatch = 12f;
    public float faithPerWardTick = 6f;  // the WARD converts caught damage INTO faith

    [Header("Events (UI / Luminary)")]
    public System.Action<float, float> OnFaithChanged;  // (current, max)
    public System.Action<Vector3> OnMoteKilled;         // kill position — motes stream to the Luminary

    private List<SkillNode> spenders = new List<SkillNode>();

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
    }

    // ── BUILDERS ──────────────────────────────────────────────
    public void GainHit() => Gain(faithPerHit);
    public void GainKill(Vector3 atPosition)
    {
        Gain(faithPerKill);
        OnMoteKilled?.Invoke(atPosition); // golden motes visibly float to the Luminary; faith lands on arrival
    }
    public void GainParry() => Gain(faithPerParryCatch);
    public void GainWard() => Gain(faithPerWardTick);

    // ── SPENDERS ─────────────────────────────────────────────
    public bool TrySpend(float cost)
    {
        if (faith < cost) return false; // the resource gate is the faith cost, never a long cooldown
        faith -= cost;
        OnFaithChanged?.Invoke(faith, maxFaith);
        return true;
    }

    public bool CanAfford(float cost) => faith >= cost;

    void Gain(float amount)
    {
        faith = Mathf.Min(maxFaith, faith + amount);
        OnFaithChanged?.Invoke(faith, maxFaith);
    }

    // Skill trees: every node is a BUILDER or a SPENDER — nothing else.
    public void RegisterSpender(SkillNode node) { if (!spenders.Contains(node)) spenders.Add(node); }
}

// One entry per ability — faith cost is the gate, cooldown is SHORT.
[System.Serializable]
public class SkillNode
{
    public string name;
    public float faithCost;
    public float cooldownSeconds = 2.5f; // TEMPO shrinks these; never the real limit
    [HideInInspector] public float lastUsed = -999f;

    public bool Ready(float now) => now - lastUsed >= cooldownSeconds;
}
