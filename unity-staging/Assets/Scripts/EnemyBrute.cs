using UnityEngine;

namespace MythosGates
{
    /// <summary>T2 brute placeholder — 3-6 hits to kill, staggers mid-fight.
    /// Faith +5 per kill. Slow approach + heavy melee.</summary>
    public class EnemyBrute : MonoBehaviour, IDamageable
    {
        public int hp = 5;
        public float moveSpeed = 1.8f;
        public float aggroDistance = 30f;
        public float hitRadius = 4f;
        public float staggerSeconds = 1.2f;
        public Animator anim;

        float _staggerTimer;
        float _hitCooldown;

        void Update()
        {
            _staggerTimer -= Time.deltaTime;
            _hitCooldown -= Time.deltaTime;
            if (_staggerTimer > 0) return;
            var player = PlayerTitan.Instance;
            if (player == null) return;
            Vector3 to = player.transform.position - transform.position; to.y = 0;
            if (to.magnitude > aggroDistance) return;
            if (to.magnitude > hitRadius)
            {
                transform.position += to.normalized * moveSpeed * Time.deltaTime;
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(to), 4f * Time.deltaTime);
            }
            else if (_hitCooldown <= 0)
            {
                _hitCooldown = 2.5f;
                // brute hit — placeholder: player takes no damage yet (HP system later)
            }
        }

        public void TakeDamage(int amount, Vector3 fromPosition)
        {
            hp -= amount;
            _staggerTimer = staggerSeconds;
            if (anim) anim.SetTrigger("Hit");
            if (hp <= 0)
            {
                FaithSystem.Instance?.Gain(5f);
                Destroy(gameObject, 2f);
                enabled = false;
            }
        }
    }
}
