using UnityEngine;
// TitanGroundSlam — windup, slam, expanding ring, crack decals, ant-launching displacement
public class TitanGroundSlam : MonoBehaviour {
    public TitanCamera cameraPivot;
    public Transform ringMesh;           // scaled 0->18m, faction-glow material
    public GameObject crackDecalPrefab;  // radiating ground cracks
    private bool _slamming;

    public void Slam() {
        if (_slamming) return;
        StartCoroutine(_SlamRoutine());
    }
    System.Collections.IEnumerator _SlamRoutine() {
        _slamming = true;
        // --- WINDUP: pull back + FOV open ---
        cameraPivot.PullBack(GameFeelConstants.SLAM_WINDUP_PULLBACK_M, GameFeelConstants.SLAM_WINDUP_FOV_ADD, GameFeelConstants.SLAM_WINDUP_S);
        yield return new WaitForSeconds(GameFeelConstants.SLAM_WINDUP_S);

        // --- IMPACT ---
        cameraPivot.AddTrauma(GameFeelConstants.SLAM_TRAUMA);
        ringMesh.gameObject.SetActive(true);
        Vector3 startScale = Vector3.one * 0.01f;
        Vector3 endScale = Vector3.one * GameFeelConstants.SLAM_RING_RADIUS_M;
        for (float t = 0; t < GameFeelConstants.SLAM_RING_EXPAND_S; t += Time.deltaTime) {
            ringMesh.localScale = Vector3.Lerp(startScale, endScale, t / GameFeelConstants.SLAM_RING_EXPAND_S);
            yield return null;
        }
        ringMesh.gameObject.SetActive(false);

        // --- CRACK DECALS: 6-10 radiating, 20deg jitter ---
        int cracks = Random.Range(6, 11);
        for (int i = 0; i < cracks; i++) {
            var c = Instantiate(crackDecalPrefab, transform.position,
                Quaternion.Euler(0f, (360f / 10f) * i + Random.Range(-20f, 20f), 0f));
        }

        // --- DISPLACEMENT: stagger + launch, no range kills (Impact > damage) ---
        foreach (var body in GameObject.FindGameObjectsWithTag("Enemy")) {
            float d = Vector3.Distance(transform.position, body.transform.position);
            if (d > GameFeelConstants.SLAM_RING_RADIUS_M) continue;
            float falloff = 1f - d / GameFeelConstants.SLAM_RING_RADIUS_M;
            Vector3 dir = (body.transform.position - transform.position).normalized;
            body.SendMessage("Stagger", (dir, falloff), SendMessageOptions.DontRequireReceiver);
            if (d < GameFeelConstants.SLAM_LAUNCH_AIRBORNE_M)
                body.SendMessage("RagdollLaunch", (dir, falloff), SendMessageOptions.DontRequireReceiver);   // ants fly
        }
        #if UNITY_ANDROID || UNITY_IOS
        Handheld.Vibrate();
        yield return new WaitForSeconds(0.12f);
        Handheld.Vibrate();
        #endif
        _slamming = false;
    }
}
