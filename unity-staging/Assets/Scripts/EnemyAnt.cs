using UnityEngine;

namespace MythosGates
{
    /// <summary>T1 'the Unmade swarm' — placeholder ant-tier. ONE TAP = kill + ragdoll.
    /// Faith +1 per kill (mercy-kill release law). Wander + drift toward player.</summary>
    public class EnemyAnt : MonoBehaviour, IDamageable
    {
        public float wanderRadius = 6f;
        public float moveSpeed = 2.5f;
        public float aggroDistance = 25f;
        Vector3 _home;
        Vector3 _target;
        float _retarget;

        void Start() { _home = transform.position; PickTarget(); }

        void PickTarget()
        {
            Vector2 r = Random.insideUnitCircle * wanderRadius;
            _target = _home + new Vector3(r.x, 0, r.y);
            _retarget = Random.Range(2f, 5f);
        }

        void Update()
        {
            _retarget -= Time.deltaTime;
            Vector3 toPlayer = PlayerTitan.Instance != null ? PlayerTitan.Instance.transform.position - transform.position : Vector3.positiveInfinity;
            if (toPlayer.magnitude < aggroDistance) _target = PlayerTitan.Instance.transform.position;
            else if (_retarget <= 0) PickTarget();

            Vector3 to = _target - transform.position; to.y = 0;
            if (to.magnitude > 0.3f)
            {
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(to), 6f * Time.deltaTime);
                transform.position += to.normalized * moveSpeed * Time.deltaTime;
            }
        }

        public void TakeDamage(int amount, Vector3 fromPosition)
        {
            // ONE TAP: ragdoll — enable physics on all children and launch away
            FaithSystem.Instance?.Gain(1f);
            foreach (var rb in GetComponentsInChildren<Rigidbody>())
            {
                rb.isKinematic = false;
                rb.AddExplosionForce(6f, fromPosition, 4f, 0.4f, ForceMode.Impulse);
            }
            foreach (var col in GetComponentsInChildren<Collider>()) col.enabled = true;
            Destroy(gameObject, 3f);
            enabled = false;
        }
    }
}
