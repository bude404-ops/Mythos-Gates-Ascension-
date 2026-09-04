using UnityEngine;
// TitanFootstep — footstep weight: crack+bass at contact, dust burst, 40ms-delayed trauma
public class TitanFootstep : MonoBehaviour {
    public TitanCamera cameraPivot;
    public ParticleSystem dust;          // ring-burst at contact
    public AudioSource bass;             // sub-bass layer
    public AudioSource crack;           // footfall crack layer

    public void FootDown(bool charging = false) {
        // 1) audio at CONTACT frame
        crack.Play();
        bass.pitch = GameFeelConstants.BASS_START_HZ / 70f;
        bass.Play();
        StartCoroutine(_BassFallRoutine());  // 70->40 Hz pitch fall

        // 2) dust ring-burst
        if (dust) { dust.Emit(Random.Range(GameFeelConstants.FOOTSTEP_DUST_MIN, GameFeelConstants.FOOTSTEP_DUST_MAX + 1)); }

        // 3) camera trauma peaks 40 ms AFTER contact
        float trauma = charging ? GameFeelConstants.FOOTSTEP_TRAUMA_CHARGE : GameFeelConstants.TRAUMA_DECAY > 0 ? GameFeelConstants.FOOTSTEP_TRAUMA_WALK : 0f;
        StartCoroutine(_DelayedTraumaRoutine(trauma));

        // 4) mobile haptic
        #if UNITY_ANDROID || UNITY_IOS
        Handheld.Vibrate();
        #endif
    }
    System.Collections.IEnumerator _BassFallRoutine() {
        float start = bass.pitch, end = GameFeelConstants.BASS_END_HZ / 70f;
        for (float t = 0; t < 0.18f; t += Time.deltaTime) { bass.pitch = Mathf.Lerp(start, end, t / 0.18f); yield return null; }
    }
    System.Collections.IEnumerator _DelayedTraumaRoutine(float trauma) {
        yield return new WaitForSeconds(GameFeelConstants.FOOTSTEP_IMPACT_DELAY_S);
        cameraPivot.AddTrauma(trauma);
    }
}
