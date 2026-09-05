using UnityEngine;

namespace MythosGates
{
    /// <summary>FAITH — the only resource (combat spec section C).
    /// +1 ant kill, +5 brute kill, +25 boss phase, passive trickle in worship zones.
    /// Specials cost 15-25, ults 60-100.</summary>
    public class FaithSystem : MonoBehaviour
    {
        public static FaithSystem Instance { get; private set; }
        public float faith = 20f;               // starting grace
        public float worshipTricklePerSec = 0.5f;
        public bool inWorshipZone;

        public event System.Action<float> OnFaithChanged;

        void Awake() { Instance = this; }

        void Update()
        {
            if (inWorshipZone)
            {
                faith += worshipTricklePerSec * Time.deltaTime;
                OnFaithChanged?.Invoke(faith);
            }
        }

        public void Gain(float amount)
        {
            faith += amount;
            OnFaithChanged?.Invoke(faith);
        }

        public bool TrySpend(float cost)
        {
            if (faith < cost) return false;
            faith -= cost;
            OnFaithChanged?.Invoke(faith);
            return true;
        }
    }
}
