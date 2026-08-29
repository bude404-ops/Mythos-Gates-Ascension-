#pragma once

#include "CoreMinimal.h"
#include "MGCombatSystem.h"
#include "MGDodgeParryResolver.generated.h"

// Auto-resolved dodge/parry system (NOT player input)
// 1. Enemy attacks -> Roll Dodge Stat vs Enemy Accuracy
// 2. If dodge succeeds -> auto-evade (animation plays)
// 3. If dodge fails -> Roll Parry Stat vs Enemy Attack Power
// 4. If parry succeeds -> reduced damage (animation plays)
// 5. Both fail -> full damage

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGDodgeParryResolver : public UObject
{
	GENERATED_BODY()

public:
	// Resolve incoming attack — returns damage multiplier (0 = evaded, 0.5 = parried, 1.0 = full hit)
	UFUNCTION(BlueprintCallable, Category = "Combat")
	static float ResolveAttack(float AttackerAccuracy, float AttackerPower,
		float DefenderDodge, float DefenderParry);

	// Roll dodge check
	UFUNCTION(BlueprintCallable, Category = "Combat")
	static bool RollDodge(float DefenderDodge, float AttackerAccuracy);

	// Roll parry check
	UFUNCTION(BlueprintCallable, Category = "Combat")
	static bool RollParry(float DefenderParry, float AttackerPower);

	// Get result enum for animation
	UFUNCTION(BlueprintCallable, Category = "Combat")
	static FName GetResultAnimation(float AttackerAccuracy, float AttackerPower,
		float DefenderDodge, float DefenderParry);
};
