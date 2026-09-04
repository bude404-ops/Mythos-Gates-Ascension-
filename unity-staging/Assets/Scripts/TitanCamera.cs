using UnityEngine;
// TitanCamera — low titan camera + trauma shake (Unity mirror of titan_camera.gd)
// Attach to the camera pivot; assign camera + target (the titan root).
public class TitanCamera : MonoBehaviour {
    public Camera cam;
    public Transform target;
    private float _trauma;
    private float _noiseT;
    private float _baseFov;

    void Start() { _baseFov = GameFeelConstants.CAM_FOV; if (cam) cam.fieldOfView = _baseFov; }

    public void AddTrauma(float amount) { _trauma = Mathf.Clamp(_trauma + amount, 0f, 1f); }

    public void PullBack(float meters, float fovAdd, float seconds) {
        StartCoroutine(_PullBackRoutine(meters, fovAdd, seconds));
    }
    System.Collections.IEnumerator _PullBackRoutine(float meters, float fovAdd, float seconds) {
        var startPos = transform.localPosition;
        var endPos = startPos - Vector3.forward * meters;
        float startFov = cam.fieldOfView, endFov = startFov + fovAdd;
        for (float t = 0; t < seconds; t += Time.deltaTime) {
            float k = t / seconds;
            transform.localPosition = Vector3.Lerp(startPos, endPos, k);
            cam.fieldOfView = Mathf.Lerp(startFov, endFov, k);
            yield return null;
        }
    }

    public void SetSprinting(bool active) {
        StopAllCoroutines();
        StartCoroutine(_FovRoutine(active ? _baseFov + GameFeelConstants.SPRINT_FOV_ADD : _baseFov));
    }
    System.Collections.IEnumerator _FovRoutine(float targetFov) {
        float start = cam.fieldOfView;
        for (float t = 0; t < GameFeelConstants.SPRINT_FOV_TIME_S; t += Time.deltaTime) {
            cam.fieldOfView = Mathf.Lerp(start, targetFov, t / GameFeelConstants.SPRINT_FOV_TIME_S);
            yield return null;
        }
    }

    void FixedUpdate() {
        _trauma = Mathf.Max(_trauma - GameFeelConstants.TRAUMA_DECAY * Time.fixedDeltaTime, 0f);
        _noiseT += Time.fixedDeltaTime * 30f;
        if (!target || !cam) return;

        // --- LOW TITAN CAMERA (eye NEVER above the knee) ---
        Vector3 back = -target.forward.normalized;
        Vector3 camPos = target.position + back * GameFeelConstants.CAM_DISTANCE_M;
        camPos.y = target.position.y + GameFeelConstants.CAM_HEIGHT_M;
        transform.position = Vector3.Lerp(transform.position, camPos, 10f * Time.fixedDeltaTime);
        transform.LookAt(target.position + Vector3.up * 6f);
        transform.Rotate(Vector3.right, GameFeelConstants.CAM_BASE_PITCH_DEG);   // +8 up-tilt

        // --- TRAUMA SHAKE (power = trauma^2) ---
        float shake = _trauma * _trauma;
        float ox = Mathf.PerlinNoise(_noiseT, 0f) * 2f - 1f;
        float oy = Mathf.PerlinNoise(0f, _noiseT) * 2f - 1f;
        float roll = (Mathf.PerlinNoise(_noiseT, _noiseT) * 2f - 1f) * GameFeelConstants.SHAKE_MAX_ROLL_DEG * Mathf.Deg2Rad * shake;
        cam.transform.localPosition = new Vector3(ox * GameFeelConstants.SHAKE_MAX_OFFSET * shake, oy * GameFeelConstants.SHAKE_MAX_OFFSET * shake, 0f);
        cam.transform.localRotation = Quaternion.Euler(0f, 0f, roll);
    }
}
