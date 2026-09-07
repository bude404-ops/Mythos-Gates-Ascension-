// PILGRIM CONTROLLER — hybrid lock-on combat (canon: DI auto-face + souls framing,
// Genshin i-frame dodge; BudE404 green-lit 'i like your hybrid joystick combat').
// Joystick = movement only. Attacks AUTO-FACE the locked target. In combat,
// movement becomes step-dodges (flick / SHIFT with i-frames). Thumb manages
// ability buttons + dodge flick. Doctrine: docs/design/PILGRIM-COMBAT-SYSTEM.md.

using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class PilgrimController : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5.2f;
    public float rotationSmooth = 12f;
    public float lockRange = 14f;

    [Header("Combo (triple)")]
    public float comboWindow = 0.55f;
    public float attackCooldown = 0.35f;
    public float hitRadius = 2.1f;
    public float hitArc = 100f;
    public int[] comboDamage = { 8, 9, 14 }; // 3rd hit = the finisher

    [Header("Dodge (i-frames)")]
    public float dodgeSpeed = 9.5f;
    public float dodgeDuration = 0.32f;
    public float iframes = 0.26f;
    public float dodgeFaithBonus = 2f; // a clean dodge feeds the flame a little

    [Header("Heavy / Bash (guard-break)")]
    public float heavyDamage = 18f;
    public float guardBreakWindow = 3.5f; // 1.75x damage window on broken elites
    public float guardBreakMultiplier = 1.75f;

    [Header("Parry catch")]
    public float parryWindow = 0.22f;

    public Transform LockTarget { get; private set; }

    private CharacterController cc;
    private Animator anim;
    private int comboStep;
    private float lastAttackEnd, lastDodge, parryStart;
    private bool inComboExtension;

    void Awake()
    {
        cc = GetComponent<CharacterController>();
        anim = GetComponentInChildren<Animator>();
    }

    void Update()
    {
        float t = Time.time;

        // ── Dodge: flick / SHIFT — i-frames while it lasts
        if (Input.GetButtonDown("Dodge") && t - lastDodge > dodgeDuration + 0.1f)
        {
            Vector2 joy = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
            Vector3 dir = joy.sqrMagnitude > 0.2f
                ? new Vector3(joy.x, 0f, joy.y).normalized
                : transform.forward;
            StartCoroutine(DodgeRoutine(dir));
            lastDodge = t;
            return;
        }

        // ── Attacks auto-face the lock target (DI layer)
        if (Input.GetButtonDown("Attack") && t - lastAttackEnd > attackCooldown)
        {
            if (t - lastAttackEnd > comboWindow) comboStep = 0;
            DoComboHit(comboStep);
            comboStep = (comboStep + 1) % comboDamage.Length;
            lastAttackEnd = t;
        }

        if (Input.GetButtonDown("Heavy")) DoHeavy();
        if (Input.GetButtonDown("Parry")) { parryStart = t; anim?.SetTrigger("Parry"); }

        // ── Movement (joystick = movement only; no lock drift)
        Vector2 move = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        Vector3 velocity = new Vector3(move.x, 0f, move.y).normalized * moveSpeed * Mathf.Clamp01(move.magnitude);
        if (velocity.sqrMagnitude > 0.01f)
            cc.Move(velocity * Time.deltaTime);

        // Face travel direction when free; face the lock when locked.
        if (LockTarget != null)
        {
            Vector3 to = LockTarget.position - transform.position; to.y = 0f;
            if (to.sqrMagnitude > 0.01f) transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(to), rotationSmooth * Time.deltaTime);
        }
        else if (velocity.sqrMagnitude > 0.01f)
        {
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(velocity), rotationSmooth * Time.deltaTime);
        }
    }

    void DoComboHit(int step)
    {
        anim?.SetInteger("ComboStep", step);
        anim?.SetTrigger("Attack");
        ApplyHit(comboDamage[step], step == 2); // finisher staggers
        if (FaithMeter.Instance) FaithMeter.Instance.GainHit();
    }

    void DoHeavy()
    {
        anim?.SetTrigger("Heavy");
        ApplyHit(heavyDamage, true, guardBreak: true);
    }

    void ApplyHit(float damage, bool stagger, bool guardBreak = false)
    {
        Collider[] hits = Physics.OverlapSphere(transform.position + transform.forward * 1.1f, hitRadius);
        foreach (var h in hits)
        {
            var enemy = h.GetComponentInParent<HollowEnemy>();
            if (enemy == null) continue;
            bool inArc = Vector3.Angle(transform.forward, enemy.transform.position - transform.position) < hitArc * 0.5f;
            if (!inArc) continue;
            enemy.TakeHit(damage, stagger, guardBreak, multiplier: enemy.GuardBroken ? guardBreakMultiplier : 1f);
        }
    }

    System.Collections.IEnumerator DodgeRoutine(Vector3 dir)
    {
        float end = Time.time + dodgeDuration;
        float iframesEnd = Time.time + iframes;
        anim?.SetTrigger("Dodge");
        while (Time.time < end)
        {
            cc.Move(dir * dodgeSpeed * Time.deltaTime);
            yield return null;
        }
        if (FaithMeter.Instance && Time.time >= iframesEnd) FaithMeter.Instance.GainHit();
        if (FaithMeter.Instance) FaithMeter.Instance.GainHit(); // dodge builds a sliver of faith — aggression is the economy
    }

    // ── Lock-on: auto-acquire nearest in range when combat starts (DI layer)
    public void AcquireLock()
    {
        Collider[] near = Physics.OverlapSphere(transform.position, lockRange);
        float best = float.MaxValue;
        Transform bestT = null;
        foreach (var n in near)
        {
            var e = n.GetComponentInParent<HollowEnemy>();
            if (e == null || e.Dead) continue;
            float d = Vector3.SqrDistance(transform.position, e.transform.position);
            if (d < best) { best = d; bestT = e.transform; }
        }
        LockTarget = bestT;
    }

    public void ReleaseLock()
    {
        if (LockTarget != null)
        {
            var e = LockTarget.GetComponentInParent<HollowEnemy>();
            if (e == null || e.Dead) LockTarget = null;
        }
    }
}
