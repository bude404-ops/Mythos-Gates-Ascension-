using System.Collections;
using UnityEngine;

namespace MythosGates.GameFeel
{
    /// <summary>Ground-slam shockwave: windup, expanding ring, cracks, radial displacement.
    /// Mirror of scripts/gamefeel/titan_groundslam.gd. Displaces — never kills at range;
    /// the titan's follow-up swing does the killing. Impact &gt; damage.</summary>
    public class TitanGroundSlam : MonoBehaviour
    {
        public TitanCamera titanCamera;
        public LayerMask enemyMask;
        public GameObject ringPrefab;          // faction-glow expanding ring quad/torus
        public GameObject crackDecalPrefab;    // radiating crack decals
        [Range(1, 2)] public int faction = 2;
        private bool _slamming;

        public void TriggerSlam()
        {
            if (!_slamming) StartCoroutine(SlamRoutine());
        }

        IEnumerator SlamRoutine()
        {
            _slamming = true;

            // --- WINDUP: 0.45 s, camera pulls back 1.5 m + FOV +4° ---
            float t = 0f;
            Vector3 camStart = titanCamera.cam.transform.position;
            while (t < GameFeelConstants.WindupSeconds)
            {
                t += Time.deltaTime;
                titanCamera.cam.transform.position = Vector3.Lerp(camStart,
                    camStart - transform.forward * GameFeelConstants.WindupCamPullbackM,
                    t / GameFeelConstants.WindupSeconds);
                yield return null;
            }

            Vector3 impact = transform.position - transform.forward * 2f;
            Impact(impact);
            _slamming = false;
        }

        void Impact(Vector3 at)
        {
            titanCamera.AddTrauma(GameFeelConstants.SlamTrauma);  // biggest shake in the game
            StartCoroutine(SpawnRing(at));
            SpawnCracks(at);
            DisplaceEnemies(at);

            if (Application.isMobilePlatform)
            {
                Handheld.Vibrate();
                StartCoroutine(DoubleTapHaptic());
            }
        }

        IEnumerator DoubleTapHaptic()
        {
            yield return new WaitForSeconds(0.08f);
            Handheld.Vibrate();
        }

        IEnumerator SpawnRing(Vector3 at)
        {
            var ring = Instantiate(ringPrefab, at, Quaternion.identity);
            float t = 0f;
            while (t < GameFeelConstants.RingExpandSeconds)
            {
                t += Time.deltaTime;
                float r = Mathf.Lerp(0f, GameFeelConstants.RingMaxRadiusM,
                                     t / GameFeelConstants.RingExpandSeconds);
                ring.transform.localScale = new Vector3(r, 1f, r);
                yield return null;
            }
            Destroy(ring, 0.15f);
        }

        void SpawnCracks()
        {
            SpawnCracks(transform.position - transform.forward * 2f);
        }

        void SpawnCracks(Vector3 at)
        {
            int n = Random.Range(6, 11);                       // 6–10 cracks, 20° jitter
            for (int i = 0; i < n; i++)
            {
                float ang = (360f * i / n) + Random.Range(-20f, 20f);
                var d = Instantiate(crackDecalPrefab, at, Quaternion.Euler(0f, ang, 0f));
                d.transform.position += new Vector3(Mathf.Cos(ang * Mathf.Deg2Rad), 0f,
                    Mathf.Sin(ang * Mathf.Deg2Rad)) * Random.Range(3f, 6f);
                Destroy(d, 6f);                                 // cracks linger, then go
            }
        }

        void DisplaceEnemies(Vector3 at)
        {
            // force ∝ (1 − dist/18 m); low-weight enemies airborne at dist < 6 m — ants fly
            Collider[] hits = Physics.OverlapSphere(at, GameFeelConstants.RingMaxRadiusM, enemyMask);
            foreach (var hit in hits)
            {
                var rb = hit.attachedRigidbody;
                if (rb == null) continue;
                Vector3 offset = rb.position - at;
                float dist = offset.magnitude;
                if (dist > GameFeelConstants.RingMaxRadiusM) continue;
                float scale = 1f - dist / GameFeelConstants.RingMaxRadiusM;
                Vector3 impulse = offset.normalized * scale * 12f;
                if (dist < GameFeelConstants.LaunchAirborneDistM)
                    impulse += Vector3.up * scale * 8f;
                rb.AddForce(impulse, ForceMode.Impulse);
            }
        }
    }
}
