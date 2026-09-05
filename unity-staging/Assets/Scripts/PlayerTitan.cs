using UnityEngine;

namespace MythosGates
{
    /// <summary>Playable giant (placeholder rig first, canon model later).
    /// Tap/click-to-move (max 30m per tap per combat spec), WASD fallback.
    /// Walk 4 m/s, charge 8 m/s. Scale: set the rig to ~9m combat manifest.</summary>
    [RequireComponent(typeof(CharacterController))]
    public class PlayerTitan : MonoBehaviour
    {
        [Header("Movement (combat spec)")]
        public float walkSpeed = 4f;
        public float chargeSpeed = 8f;
        public float tapMoveMaxDistance = 30f;
        public float gravity = -20f;

        [Header("Combat (L1 melee)")]
        public float l1Range = 7f;
        public float l1ArcDeg = 90f;
        public float l1Windup = 0.35f;
        public float l1Recovery = 0.45f;
        public LayerMask enemyMask = ~0;

        [Header("Animator (Mixamo placeholder clips)")]
        public Animator anim;
        [Tooltip("Mixamo clip names you import — assign in Inspector")]
        public string idleClip = "idle";
        public string walkClip = "walking";
        public string chargeClip = "running";
        public string attackClip = "slash";

        public static PlayerTitan Instance { get; private set; }
        private CharacterController _cc;
        private Camera _cam;
        private Vector3 _moveTarget;
        private bool _hasTarget;
        private float _attackTimer;
        private bool _charging;
        private float _vSpeed;

        void Awake()
        {
            Instance = this;
            _cc = GetComponent<CharacterController>();
            _cam = Camera.main;
            _moveTarget = transform.position;
        }

        void Update()
        {
            HandleInput();
            HandleAttack();
            Move();
        }

        void HandleInput()
        {
            // Click / tap to move — raycast to ground, clamp to 30m
            if (Input.GetMouseButtonDown(0))
            {
                var ray = _cam.ScreenPointToRay(Input.mousePosition);
                if (Physics.Raycast(ray, out var hit, 200f))
                {
                    Vector3 flat = hit.point; flat.y = transform.position.y;
                    Vector3 offset = flat - transform.position;
                    if (offset.magnitude > tapMoveMaxDistance)
                        flat = transform.position + offset.normalized * tapMoveMaxDistance;
                    _moveTarget = flat;
                    _hasTarget = true;
                }
            }
            _charging = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.W) && Input.GetKey(KeyCode.LeftShift);
        }

        void HandleAttack()
        {
            _attackTimer -= Time.deltaTime;
            if (Input.GetMouseButtonDown(1) && _attackTimer <= 0f)
            {
                _attackTimer = l1Windup + l1Recovery;
                if (anim) anim.Play(attackClip, 0, 0f);
                Invoke(nameof(Strike), l1Windup);
            }
        }

        void Strike()
        {
            // 7m arc in front — anything hit takes one L1
            Collider[] hits = Physics.OverlapSphere(transform.position + transform.forward * (l1Range * 0.5f), l1Range * 0.6f, enemyMask);
            foreach (var h in hits)
            {
                Vector3 to = h.transform.position - transform.position;
                if (Vector3.Angle(transform.forward, to) > l1ArcDeg * 0.5f) continue;
                h.GetComponent<IDamageable>()?.TakeDamage(1, transform.position);
            }
        }

        void Move()
        {
            // WASD override
            Vector3 wasd = new Vector3(Input.GetAxisRaw("Horizontal"), 0, Input.GetAxisRaw("Vertical"));
            if (wasd.sqrMagnitude > 0.01f)
            {
                wasd = Camera.main.transform.TransformDirection(wasd); wasd.y = 0; wasd.Normalize();
                _hasTarget = false;
                Apply(wasd);
                return;
            }
            if (!_hasTarget) { Idle(); return; }
            Vector3 to = _moveTarget - transform.position; to.y = 0;
            if (to.magnitude < 0.5f) { _hasTarget = false; Idle(); return; }
            Apply(to.normalized);
        }

        void Apply(Vector3 dir)
        {
            float speed = _charging ? chargeSpeed : walkSpeed;
            if (_attackTimer > l1Recovery * 0.5f) speed = 0f; // rooted during windup
            if (anim && speed > 0f) anim.Play(_charging ? chargeClip : walkClip, 0, 0.25f);
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(dir), 8f * Time.deltaTime);
            _vSpeed = _cc.isGrounded ? 0 : _vSpeed + gravity * Time.deltaTime;
            _cc.Move((dir * speed + Vector3.up * _vSpeed) * Time.deltaTime);
        }

        void Idle()
        {
            if (anim) anim.Play(idleClip, 0, 0.25f);
            _vSpeed = _cc.isGrounded ? 0 : _vSpeed + gravity * Time.deltaTime;
            _cc.Move(Vector3.up * _vSpeed * Time.deltaTime);
        }
    }
}
