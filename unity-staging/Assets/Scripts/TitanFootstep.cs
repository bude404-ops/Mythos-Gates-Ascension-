using UnityEngine;

namespace MythosGates.GameFeel
{
    /// <summary>Footstep weight: shake + dust burst + falling bass thump.
    /// Mirror of scripts/gamefeel/titan_footstep.gd. Call FootContact() from the walk
    /// animation's foot-plant keyframe (Animation Event).</summary>
    public class TitanFootstep : MonoBehaviour
    {
        public TitanCamera titanCamera;
        public ParticleSystem dustPrefab;      // ring-burst emitter, faction-colored
        public AudioSource bassThump;          // 70->40 Hz falling sub-bass, -6 dB
        [Range(1, 2)] public int faction = 1;  // 1 = F001 sandstone, 2 = F002 granite
        public bool charging;

        public void FootContact(Vector3 footWorldPos)
        {
            if (titanCamera != null)
                titanCamera.AddTrauma(charging ? GameFeelConstants.ChargeTrauma
                                              : GameFeelConstants.WalkTrauma);

            BurstDust(footWorldPos);
            if (bassThump != null) bassThump.Play();

            if (Application.isMobilePlatform)
                Handheld.Vibrate();  // 25 ms class; map to medium impact via NI API
        }

        void BurstDust(Vector3 at)
        {
            if (dustPrefab == null) return;
            int count = Random.Range(GameFeelConstants.DustParticlesMin,
                                     GameFeelConstants.DustParticlesMax + 1);
            var ps = Instantiate(dustPrefab, at + Vector3.up * 0.05f, Quaternion.identity);
            var main = ps.main;
            main.startLifetime = new ParticleSystem.MinMaxCurve(
                GameFeelConstants.DustLifetimeMin, GameFeelConstants.DustLifetimeMax);
            var colMod = ps.colorOverLifetime;
            colMod.enabled = true;
            // F001 = warm sandstone tan, F002 = cold grey granite (spec section 1)
            Color baseCol = faction == 1 ? new Color(0.78f, 0.66f, 0.47f)
                                         : new Color(0.55f, 0.58f, 0.63f);
            var grad = new Gradient();
            grad.SetKeys(
                new[] { new GradientColorKey(baseCol, 0f), new GradientColorKey(baseCol, 1f) },
                new[] { new GradientAlphaKey(0.9f, 0f), new GradientAlphaKey(0.5f, 0.4f),
                         new GradientAlphaKey(0f, 1f) });
            colMod.color = new ParticleSystem.MinMaxGradient(grad);
            ps.Emit(count);
            Destroy(ps.gameObject, GameFeelConstants.DustLifetimeMax + 0.5f);
        }
    }
}
