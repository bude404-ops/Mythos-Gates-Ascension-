// TitanCamera — low titan camera + trauma shake (Game-feel #1 + #3)
// Attach to camera pivot GameObject; assign target (titan) and the child Camera.
using UnityEngine;

public class TitanCamera : MonoBehaviour {
    public Transform target;
    public new Camera camera;
    public float trauma = 0f;
    private float _baseFov;

    void Start() { _baseFov = GameFeelConstants.CamFov; camera.fieldOfView = _baseFov; }
    void Update() { trauma = Mathf.Max(trauma - GameFeelConstants.TraumaDecay * Time.deltaTime, 0f); }

    public void AddTrauma(float amount) { trauma = Mathf.Clamp01(trauma + amount); }
    public void SetSprinting(bool active) {
        StartCoroutine(FovTo(_baseFov + (active ? GameFeelConstants.SprintFovAdd : 0f),
                            GameFeelConstants.SprintFovTimeS));
    }
    public void PullBack(float metres, float fovAdd, float seconds) {
        StartCoroutine(PullBackRoutine(metres, fovAdd, seconds));  // windup dread beat
    }
    System.Collections.IEnumerator PullBackRoutine(float m, float fov, float s) {
        Vector3 start = transform.localPosition; float f0 = camera.fieldOfView;
        for (float t = 0; t < s; t += Time.deltaTime) {
            transform.localPosition = start - transform.forward * m * (t / s);
            camera.fieldOfView = f0 + fov * (t / s);
            yield return null;
        }
    }
    System.Collections.IEnumerator FovTo(float fov, float s) {
        float f0 = camera.fieldOfView;
        for (float t = 0; t < s; t += Time.deltaTime) { camera.fieldOfView = Mathf.Lerp(f0, fov, t / s); yield return null; }
    }

    void LateUpdate() {
        if (target == null || camera == null) return;
        // LOW TITAN RIG: 7 m back, 1.6 m high — the player's eye never above the knee
        Vector3 back = -target.forward;
        Vector3 pos = target.position + back * GameFeelConstants.CamDistanceM;
        pos.y = target.position.y + GameFeelConstants.CamHeightM;
        transform.position = Vector3.Lerp(transform.position, pos, 10f * Time.deltaTime);
        transform.LookAt(target.position + Vector3.up * 6f);
        transform.Rotate(GameFeelConstants.CamBasePitchDeg, 0f, 0f);

        // TRAUMA SHAKE: trauma^2, perlin offsets, capped roll
        float shake = trauma * trauma;
        float t = Time.time * 30f;
        float ox = (Mathf.PerlinNoise(t, 0f) - 0.5f) * 2f * GameFeelConstants.ShakeMaxOffset * shake;
        float oy = (Mathf.PerlinNoise(0f, t) - 0.5f) * 2f * GameFeelConstants.ShakeMaxOffset * shake;
        float roll = (Mathf.PerlinNoise(t, t) - 0.5f) * 2f * GameFeelConstants.ShakeMaxRollDeg * shake;
        camera.transform.localPosition = new Vector3(ox, oy, 0f);
        camera.transform.localRotation = Quaternion.Euler(0f, 0f, roll);
    }
}
