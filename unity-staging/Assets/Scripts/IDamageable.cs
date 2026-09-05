using UnityEngine;

namespace MythosGates
{
    public interface IDamageable
    {
        void TakeDamage(int amount, Vector3 fromPosition);
    }
}
