using UnityEngine;

namespace MythosGates.GameFeel
{
    /// <summary>Trauma-based camera shake + LOW TITAN CAMERA (mortal eye height).
    /// Mirror of scripts/gamefeel/titan_camera.gd. Attach to the player titan prefab.</summary>
    public class TitanCamera : MonoBehaviour
    {
        public Camera cam;

        private float _trauma;
        private float _traumaPending;
        private float _traumaTimer;
        private float _t;
        private float _sprintFov;

        void Awake()
        {
            if (cam == null) cam = Camera.main;
        }

        public void AddTrauma(float amount)
        {
            _traumaPending = Mathf.Clamp01(_trauma + amount);
            _traumaTimer = GameFeelConstants.ImpactDelayMs / 1000f; // sound leads the camera
        }

        public void SetSprinting(bool active)
        {
            StartCoroutine(FovTween(active ? GameFeelConstants.SprintFovAdd : 0f,
                                    GameFeelConstants.SprintFovTime));
        }

        System.Collections.IEnumerator FovTween(float target, float dur)
        {
            float start = _sprintFov, e = 0f;
            while (e < dur)
            {
                e += Time.deltaTime;
                _sprintFov = Mathf.Lerp(start, target, e / dur);
                yield return null;
            }
            _sprintFov = target;
        }

        void LateUpdate()
        {
            _t += Time.deltaTime;

            if (_traumaPending > 0f)
            {
                _traumaTimer -= Time.deltaTime;
                if (_traumaTimer <= 0f) { _trauma = _traumaPending; _traumaPending = 0f; }
            }
            _trauma = Mathf.Max(0f, _trauma - GameFeelConstants.TraumaDecayPerSecond * Time.deltaTime);

            // --- LOW CAM: mortal eye height, never above the titan's knee ---
            Vector3 back = -transform.forward;
            Vector3 anchor = transform.position + back * GameFeelConstants.CamDistance;
            anchor.y = GroundY(anchor) + GameFeelConstants.CamHeightMortal;
            cam.transform.position = Vector3.Lerp(cam.transform.position, anchor, 10f * Time.deltaTime);

            // --- TRAUMA SHAKE: offset ∝ trauma², Perlin-driven ---
            float pow = _trauma * _trauma;
            float ox = Mathf.PerlinNoise(_t * 12f, 0f) * 2f - 1f;
            float oy = Mathf.PerlinNoise(0f, _t * 12f + 100f) * 2f - 1f;
            float roll = (Mathf.PerlinNoise(_t * 12f + 200f, 0f) * 2f - 1f)
                         * GameFeelConstants.ShakeMaxRollDeg * pow;
            cam.transform.position += new Vector3(ox, oy, 0f) * GameFeelConstants.ShakeMaxOffsetM * pow;
            cam.transform.rotation = Quaternion.Euler(
                -GameFeelConstants.PitchBaseDeg, transform.eulerAngles.y, roll);

            float fov = GameFeelConstants.FovBase + _sprintFov;
            cam.fieldOfView = fov;
        }

        float GroundY(Vector3 pos)
        {
            RaycastHit hit;
            if (Physics.Raycast(pos + Vector3.up * 50f, Vector3.down, out hit, 250f))
                return hit.point.y;
            return 0f;
        }
    }
}
