#include "MGDodgeParryResolver.h"
#include "Math/UnrealMathUtility.h"

float UMGDodgeParryResolver::ResolveAttack(float AttackerAccuracy, float AttackerPower,
	float DefenderDodge, float DefenderParry)
{
	if (RollDodge(DefenderDodge, AttackerAccuracy))
		return 0.0f; // Full evade

	if (RollParry(DefenderParry, AttackerPower))
		return 0.5f; // Reduced damage (50%)

	return 1.0f; // Full damage
}

bool UMGDodgeParryResolver::RollDodge(float DefenderDodge, float AttackerAccuracy)
{
	// Dodge chance = DefenderDodge / (DefenderDodge + AttackerAccuracy)
	float DodgeChance = DefenderDodge / (DefenderDodge + AttackerAccuracy + 1.0f);
	float Roll = FMath::FRand();
	return Roll < DodgeChance;
}

bool UMGDodgeParryResolver::RollParry(float DefenderParry, float AttackerPower)
{
	// Parry chance = DefenderParry / (DefenderParry + AttackerPower)
	float ParryChance = DefenderParry / (DefenderParry + AttackerPower + 1.0f);
	float Roll = FMath::FRand();
	return Roll < ParryChance;
}

FName UMGDodgeParryResolver::GetResultAnimation(float AttackerAccuracy, float AttackerPower,
	float DefenderDodge, float DefenderParry)
{
	if (RollDodge(DefenderDodge, AttackerAccuracy))
		return "DodgeEvade";

	if (RollParry(DefenderParry, AttackerPower))
		return "ParryBlock";

	return "HitReact";
}
