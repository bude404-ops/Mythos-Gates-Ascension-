#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MGCombatSystem.generated.h"

// Combat System v3.0.0
// Controls: Tap-to-move, auto basic attacks, 3-4 ability buttons, 1 dodge button
// Dodge/Parry: Auto-resolved stat checks (not player input)
// Dodge Button: Spatial dash reposition only (no i-frames)
// Resources: Divine Energy (abilities), Belief Bar (ultimate), Faction Resource (passive)

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

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float HP = 100.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Attack = 10.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Range = 2.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Speed = 5.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Dodge = 50.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Parry = 40.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Accuracy = 80.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Armor = 15.0f;
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
