#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MGCombatSystem.generated.h"

// Combat System v3.0.0
// Controls: Tap-to-move, auto basic attacks, 3-4 ability buttons, 1 dodge button
// Dodge/Parry: Auto-resolved stat checks (not player input)
// Dodge Button: Spatial dash reposition only (no i-frames)
// Resources: Divine Energy (abilities), Belief Bar (ultimate), Faction Resource (passive)

// === PROGRESSION SCALING CONSTANTS ===
// Formula: Stat(L) = Base * (1 + Rate * (L - 1))
// These rates ensure dodge/parry percentages stay constant across all levels
// because deity defensive stats and enemy offensive stats scale at identical rates.

#define MG_HP_SCALE_RATE 0.12f        // +12% per level (8.08x at L60)
#define MG_ATK_SCALE_RATE 0.10f       // +10% per level (6.90x at L60)
#define MG_DEF_SCALE_RATE 0.08f       // +8% per level (5.72x at L60)
#define MG_SPD_SCALE_RATE 0.03f       // +3% per level (2.77x at L60)
#define MG_DODGE_SCALE_RATE 0.06f     // +6% per level (4.54x at L60)
#define MG_PARRY_SCALE_RATE 0.06f     // +6% per level (4.54x at L60)
#define MG_ACC_SCALE_RATE 0.06f      // +6% per level (4.54x at L60)
#define MG_ENEMY_HP_SCALE_RATE 0.12f // Matches deity HP
#define MG_ENEMY_ATK_SCALE_RATE 0.10f // Matches deity ATK
#define MG_ENEMY_ACC_SCALE_RATE 0.06f // Matches deity Dodge/Parry
#define MG_ENEMY_POW_SCALE_RATE 0.06f // Matches deity Dodge/Parry
#define MG_MAX_LEVEL 60

UENUM(BlueprintType)
enum class EMGCombatRole : uint8
{
	Warrior UMETA(DisplayName = "Warrior"),
	Caster UMETA(DisplayName = "Caster"),
	Archer UMETA(DisplayName = "Archer"),
	Assassin UMETA(DisplayName = "Assassin")
};

UENUM(BlueprintType)
enum class EMGAbilitySlot : uint8
{
	BasicAttack UMETA(DisplayName = "Basic Attack"),
	Ability1 UMETA(DisplayName = "Ability 1"),
	Ability2 UMETA(DisplayName = "Ability 2"),
	Signature UMETA(DisplayName = "Signature"),
	Ultimate UMETA(DisplayName = "Ultimate"),
	Passive UMETA(DisplayName = "Passive")
};

USTRUCT(BlueprintType)
struct FMGDeityStats
{
	GENERATED_BODY()

	// Base stats (at Level 1)
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float HP = 50.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Attack = 10.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Defense = 19.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Speed = 2.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Range = 2.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Dodge = 35.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Parry = 40.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Accuracy = 82.0f;

	// Current level (affects scaled stats)
	UPROPERTY(BlueprintReadWrite, Category = "Progression")
	int32 Level = 1;

	// Get scaled stat at current level
	float GetScaledHP() const { return HP * (1.0f + MG_HP_SCALE_RATE * (Level - 1)); }
	float GetScaledAttack() const { return Attack * (1.0f + MG_ATK_SCALE_RATE * (Level - 1)); }
	float GetScaledDefense() const { return Defense * (1.0f + MG_DEF_SCALE_RATE * (Level - 1)); }
	float GetScaledSpeed() const { return Speed * (1.0f + MG_SPD_SCALE_RATE * (Level - 1)); }
	float GetScaledDodge() const { return Dodge * (1.0f + MG_DODGE_SCALE_RATE * (Level - 1)); }
	float GetScaledParry() const { return Parry * (1.0f + MG_PARRY_SCALE_RATE * (Level - 1)); }
	float GetScaledAccuracy() const { return Accuracy * (1.0f + MG_ACC_SCALE_RATE * (Level - 1)); }

	// Armor reduction percentage (0.0 to 1.0)
	float GetArmorReduction() const
	{
		float ScaledDef = GetScaledDefense();
		return ScaledDef / (ScaledDef + 100.0f);
	}
};

USTRUCT(BlueprintType)
struct FMGAbilityData
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	FName Name;

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	EMGAbilitySlot Slot = EMGAbilitySlot::Ability1;

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	float Cooldown = 6.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	float EnergyCost = 25.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	float BeliefCost = 0.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Ability")
	FString Effect;
};

// === STAT TEMPLATES PER ROLE ===
// These are the baseline L1 stats for each combat role
// Individual deities get ±2 variation for flavor within these baselines

namespace MGStatTemplates
{
	static const FMGDeityStats Warrior()
	{
		FMGDeityStats S;
		S.HP = 50.0f; S.Attack = 10.0f; S.Defense = 19.0f;
		S.Speed = 2.0f; S.Range = 2.0f;
		S.Dodge = 35.0f; S.Parry = 40.0f; S.Accuracy = 82.0f;
		return S;
	}

	static const FMGDeityStats Caster()
	{
		FMGDeityStats S;
		S.HP = 40.0f; S.Attack = 12.0f; S.Defense = 9.0f;
		S.Speed = 3.0f; S.Range = 3.0f;
		S.Dodge = 30.0f; S.Parry = 15.0f; S.Accuracy = 85.0f;
		return S;
	}

	static const FMGDeityStats Archer()
	{
		FMGDeityStats S;
		S.HP = 38.0f; S.Attack = 11.0f; S.Defense = 8.0f;
		S.Speed = 3.0f; S.Range = 4.0f;
		S.Dodge = 55.0f; S.Parry = 10.0f; S.Accuracy = 88.0f;
		return S;
	}

	static const FMGDeityStats Assassin()
	{
		FMGDeityStats S;
		S.HP = 42.0f; S.Attack = 13.0f; S.Defense = 12.0f;
		S.Speed = 2.0f; S.Range = 2.0f;
		S.Dodge = 60.0f; S.Parry = 25.0f; S.Accuracy = 80.0f;
		return S;
	}
}

// === ENEMY BASE STATS (L1) ===
namespace MGEnemyBaseStats
{
	struct FEnemyStats
	{
		float HP, Attack, Accuracy, Power, MoveSpeed, AttackRange, AttackCooldown;
	};

	static const FEnemyStats Swarmer()   { return { 30,  5, 50,  8, 400, 100, 1.5f }; }
	static const FEnemyStats Brute()     { return { 150, 15, 55, 18, 200, 150, 3.0f }; }
	static const FEnemyStats Hunter()     { return { 50,  10, 70, 10, 250, 600, 2.5f }; }
	static const FEnemyStats Controller() { return { 80,  8, 55, 10, 300, 400, 2.0f }; }
	static const FEnemyStats Disruptor()  { return { 70,  7, 65,  9, 350, 300, 1.8f }; }
	static const FEnemyStats Guardian()   { return { 200, 12, 55, 15, 150, 120, 2.5f }; }
	static const FEnemyStats Executioner() { return { 100, 20, 60, 22, 300, 150, 3.5f }; }
	static const FEnemyStats Elite()      { return { 120, 14, 65, 16, 280, 200, 2.0f }; }
	static const FEnemyStats Champion()   { return { 300, 18, 70, 20, 250, 180, 2.2f }; }
	static const FEnemyStats EnemyDeity()  { return { 500, 25, 80, 28, 300, 250, 1.5f }; }

	// Scale enemy stats by level (MUST match deity scaling rates)
	static float ScaleHP(float Base, int32 Level) { return Base * (1.0f + MG_ENEMY_HP_SCALE_RATE * (Level - 1)); }
	static float ScaleATK(float Base, int32 Level) { return Base * (1.0f + MG_ENEMY_ATK_SCALE_RATE * (Level - 1)); }
	static float ScaleAcc(float Base, int32 Level) { return Base * (1.0f + MG_ENEMY_ACC_SCALE_RATE * (Level - 1)); }
	static float ScalePower(float Base, int32 Level) { return Base * (1.0f + MG_ENEMY_POW_SCALE_RATE * (Level - 1)); }
}
