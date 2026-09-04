using UnityEngine;

namespace MythosGates.GameFeel
{
    /// <summary>Single source of tuning truth — mirrored from docs/GAMEFEEL_TOP3_SPEC.md
    /// and the Godot scripts/gamefeel/ headers. Change here = change everywhere.</summary>
    public static class GameFeelConstants
    {
        // --- Section 1: Footstep weight ---
        public const float WalkTrauma = 0.22f;
        public const float ChargeTrauma = 0.34f;
        public const float TraumaDecayPerSecond = 1.8f;
        public const float ShakeMaxOffsetM = 0.35f;
        public const float ShakeMaxRollDeg = 1.2f;
        public const int ImpactDelayMs = 40;
        public const int DustParticlesMin = 36;
        public const int DustParticlesMax = 48;
        public const float DustLifetimeMin = 0.9f;
        public const float DustLifetimeMax = 1.4f;
        public const float BassFreqStart = 70f;
        public const float BassFreqEnd = 40f;

        // --- Section 2: Ground-slam shockwave ---
        public const float WindupSeconds = 0.45f;
        public const float WindupCamPullbackM = 1.5f;
        public const float WindupFovAdd = 4f;
        public const float RingMaxRadiusM = 18f;
        public const float RingExpandSeconds = 0.7f;
        public const float SlamTrauma = 0.65f;
        public const float LaunchAirborneDistM = 6f;
        public const int PulseMs = 40;

        // --- Section 3: Low titan camera ---
        public const float CamHeightMortal = 1.6f;
        public const float CamDistance = 7f;
        public const float FovBase = 50f;
        public const float PitchBaseDeg = 8f;
        public const float LookUpMaxDeg = 35f;
        public const float SprintFovAdd = 6f;
        public const float SprintFovTime = 0.3f;
    }
}
