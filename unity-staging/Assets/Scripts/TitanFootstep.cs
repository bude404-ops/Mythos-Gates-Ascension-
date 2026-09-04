// TitanFootstep — footstep weight: dust burst, 70->40Hz bass fall, 40ms-delayed trauma
// Attach under the titan; assign cameraPivot, dust (one-shot ParticleSystem),
// bass + crack (AudioSources).
using UnityEngine;

public class TitanFootstep : MonoBehaviour {
    public TitanCamera cameraPivot;
    public ParticleSystem dust;
    public AudioSource bass, crack;

    public void FootDown(bool charging = false) {
        // 1) audio at CONTACT frame — crack + falling sub-bass
        crack.Play();
        bass.pitch = GameFeelConstants.BassStartHz / 70f;
        bass.Play();
        StartCoroutine(BassFall());

        // 2) dust ring-burst
        var em = dust.emission; em.SetBursts(new[] { new ParticleSystem.Burst(0f,
            (short)Random.Range(GameFeelConstants.FootstepDustMin, GameFeelConstants.FootstepDustMax)) });
        dust.Play();

        // 3) trauma peaks 40 ms AFTER contact
        StartCoroutine(TraumaAfter(GameFeelConstants.FootstepImpactDelayMs / 1000f,
            charging ? GameFeelConstants.FootstepTraumaCharge : GameFeelConstants.FootstepTraumaWalk));

        // 4) mobile haptic
        #if UNITY_ANDROID || UNITY_IOS
        Handheld.Vibrate();
        #endif
    }
    System.Collections.IEnumerator BassFall() {
        for (float t = 0; t < 0.18f; t += Time.deltaTime) {
            bass.pitch = Mathf.Lerp(GameFeelConstants.BassStartHz, GameFeelConstants.BassEndHz, t / 0.18f) / 70f;
            yield return null;
        }
    }
    System.Collections.IEnumerator TraumaAfter(float delay, float amount) {
        yield return new WaitForSeconds(delay);
        cameraPivot.AddTrauma(amount);
    }
}
