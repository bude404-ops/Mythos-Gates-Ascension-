// TitanGroundSlam — windup, expanding ring, crack decals, ant-launching displacement
// Attach under the titan; assign cameraPivot, ringTransform (scaled ring mesh w/ faction
// glow material), crackDecal (GameObject), enemies on layer "Enemies" or tag "Enemy".
using UnityEngine;
using System.Collections.Generic;

public class TitanGroundSlam : MonoBehaviour {
    public TitanCamera cameraPivot;
    public Transform ring;
    public GameObject crackDecal;
    public Material ringMaterial;                 // faction glow color in emission
    private bool _slamming = false;

    public void Slam() {
        if (_slamming) return;
        StartCoroutine(SlamRoutine());
    }

    System.Collections.IEnumerator SlamRoutine() {
        _slamming = true;
        // WINDUP: pull back + FOV open (dread beat)
        cameraPivot.PullBack(GameFeelConstants.SlamWindupPullbackM,
                             GameFeelConstants.SlamWindupFovAdd, GameFeelConstants.SlamWindupS);
        yield return new WaitForSeconds(GameFeelConstants.SlamWindupS);

        // IMPACT: biggest trauma in the game
        cameraPivot.AddTrauma(GameFeelConstants.SlamTrauma);
        ring.localScale = Vector3.one * 0.01f;
        ring.gameObject.SetActive(true);
        float r0 = 0.01f;
        for (float t = 0; t < GameFeelConstants.SlamRingExpandS; t += Time.deltaTime) {
            float k = t / GameFeelConstants.SlamRingExpandS;
            ring.localScale = Vector3.one * Mathf.Lerp(r0, GameFeelConstants.SlamRingRadiusM, k);
            if (ringMaterial) ringMaterial.SetFloat("_Alpha", 1f - k);   // fades with radius
            yield return null;
        }
        ring.gameObject.SetActive(false);

        // CRACK DECALS: 6-10 radiating, 20 deg jitter
        int n = Random.Range(6, 11);
        for (int i = 0; i < n; i++) {
            var c = Instantiate(crackDecal, transform.position,
                Quaternion.Euler(90f, (360f / 10f) * i + Random.Range(-20f, 20f), 0f), transform);
        }

        // DISPLACEMENT: stagger + launch, no kills at range (Impact > damage)
        foreach (var e in GameObject.FindGameObjectsWithTag("Enemy")) {
            float d = Vector3.Distance(transform.position, e.transform.position);
            if (d > GameFeelConstants.SlamRingRadiusM) continue;
            float falloff = 1f - d / GameFeelConstants.SlamRingRadiusM;
            Vector3 dir = (e.transform.position - transform.position).normalized;
            e.SendMessage("Stagger", (dir * falloff), SendMessageOptions.DontRequireReceiver);
            if (d < GameFeelConstants.SlamLaunchAirborneM)
                e.SendMessage("RagdollLaunch", (dir * falloff), SendMessageOptions.DontRequireReceiver);
        }
        _slamming = false;
    }
}
