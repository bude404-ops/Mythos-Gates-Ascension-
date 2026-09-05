using UnityEngine;

namespace MythosGates
{
    /// <summary>Worship zone — passive FAITH trickle while the giant stands in it.
    /// Later: visual = kneeling sprite procession + prayer-light streams.</summary>
    public class WorshipZone : MonoBehaviour
    {
        void OnTriggerEnter(Collider other)
        {
            if (other.GetComponent<PlayerTitan>() && FaithSystem.Instance != null)
                FaithSystem.Instance.inWorshipZone = true;
        }
        void OnTriggerExit(Collider other)
        {
            if (other.GetComponent<PlayerTitan>() && FaithSystem.Instance != null)
                FaithSystem.Instance.inWorshipZone = false;
        }
    }
}
