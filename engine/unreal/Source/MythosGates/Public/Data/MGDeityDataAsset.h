#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGCombatSystem.h"
#include "MGDeityDataAsset.generated.h"

// Primary data asset for each deity
// Loaded from DataTables or directly assigned in Blueprints

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGDeityDataAsset : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadWrite, Category = "Deity")
	FName DeityName;

	UPROPERTY(BlueprintReadWrite, Category = "Deity")
	EMGCombatRole CombatRole = EMGCombatRole::Warrior;

	UPROPERTY(BlueprintReadWrite, Category = "Deity")
	FName Faction;

	UPROPERTY(BlueprintReadWrite, Category = "Deity")
	FMGDeityStats Stats;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData BasicAttack;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData Ability1;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData Ability2;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData Signature;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData Ultimate;

	UPROPERTY(BlueprintReadWrite, Category = "Abilities")
	FMGAbilityData Passive;

	UPROPERTY(BlueprintReadWrite, Category = "Art")
	FName ArtworkPath;

	UPROPERTY(BlueprintReadWrite, Category = "Progression")
	int32 MaxLevel = 60;
};
