// GameFeelConstants — mirrors scripts/gamefeel/gamefeel_constants.gd (single tuning source)
public static class GameFeelConstants {
    public const float FootstepTraumaWalk   = 0.22f;
    public const float FootstepTraumaCharge = 0.34f;
    public const float TraumaDecay          = 1.8f;   // per second, shake power = trauma^2
    public const float ShakeMaxOffset       = 0.35f;  // metres at trauma = 1
    public const float ShakeMaxRollDeg      = 1.2f;
    public const int   FootstepDustMin      = 36;
    public const int   FootstepDustMax      = 48;
    public const float FootstepImpactDelayMs = 40f;
    public const float BassStartHz          = 70f;
    public const float BassEndHz            = 40f;
    public const float SlamWindupS          = 0.45f;
    public const float SlamWindupPullbackM  = 1.5f;
    public const float SlamWindupFovAdd     = 4f;
    public const float SlamRingRadiusM      = 18f;
    public const float SlamRingExpandS      = 0.7f;
    public const float SlamTrauma           = 0.65f;
    public const float SlamLaunchAirborneM  = 6f;
    public const float CamHeightM          = 1.6f;    // mortal eye height, never above the knee
    public const float CamDistanceM        = 7f;
    public const float CamFov              = 50f;
    public const float CamBasePitchDeg     = 8f;
    public const float CamLookUpMaxDeg     = 35f;
    public const float SprintFovAdd        = 6f;
    public const float SprintFovTimeS      = 0.3f;
}
