// PILGRIM CAMERA — Camera Doctrine v3 (canon): STANDARD third-person, behind the
// pilgrim's back, slightly elevated, like mainstream action games. Front view is
// GOD-scale only. In combat: souls-style lock-on framing (behind pilgrim, relative
// to target). Doctrine: docs/design/PILGRIM-COMBAT-SYSTEM.md + camera law memory.

using UnityEngine;

public class PilgrimCamera : MonoBehaviour
{
    [Header("Behind-back framing (doctrine default)")]
    public Vector3 offset = new Vector3(0f, 7.6f, -8.2f); // slightly high, Diablo-ish read
    public float followSmooth = 8f;
    public float lookAhead = 3.5f;

    [Header("Lock-on framing (souls style)")]
    public float lockOnHeight = 2.4f;
    public float lockOnSide = 2.2f;
    public float lockOnSmooth = 6f;
    public float fovExplore = 58f;
    public float fovLockOn = 52f;

    private Transform pilgrim;
    private PilgrimController controller;
    private Camera cam;

    void Awake()
    {
        cam = GetComponent<Camera>();
        pilgrim = GameObject.FindGameObjectWithTag("Pilgrim")?.transform;
        controller = pilgrim ? pilgrim.GetComponent<PilgrimController>() : null;
    }

    void LateUpdate()
    {
        if (pilgrim == null)
        {
            pilgrim = GameObject.FindGameObjectWithTag("Pilgrim")?.transform;
            controller = pilgrim ? pilgrim.GetComponent<PilgrimController>() : null;
            return;
        }

        Transform target = controller && controller.LockTarget ? controller.LockTarget : null;
        float dt = Time.deltaTime;

        if (target != null)
        {
            // Souls framing: camera behind the pilgrim relative to the duel axis.
            Vector3 toTarget = (target.position - pilgrim.position).normalized;
            Vector3 camPos = pilgrim.position - toTarget * Mathf.Abs(offset.z);
            camPos += Vector3.up * lockOnHeight;
            camPos += Vector3.Cross(Vector3.up, toTarget) * lockOnSide * 0.35f; // slight souls offset
            transform.position = Vector3.Lerp(transform.position, camPos, lockOnSmooth * dt);

            Vector3 look = (pilgrim.position + toTarget * lookAhead + Vector3.up * 1.4f) - transform.position;
            Quaternion rot = Quaternion.LookRotation(look);
            transform.rotation = Quaternion.Slerp(transform.rotation, rot, lockOnSmooth * dt);

            cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, fovLockOn, 4f * dt);
        }
        else
        {
            Vector3 desired = pilgrim.position + pilgrim.rotation * offset;
            transform.position = Vector3.Lerp(transform.position, desired, followSmooth * dt);
            Quaternion rot = Quaternion.Euler(20f, pilgrim.eulerAngles.y, 0f);
            transform.rotation = Quaternion.Slerp(transform.rotation, rot, followSmooth * dt * 0.7f);
            cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, fovExplore, 4f * dt);
        }
    }
}
