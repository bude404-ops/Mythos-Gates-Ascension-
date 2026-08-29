#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MGCombatSystem.h"
#include "MGAvatarCharacter.generated.h"

// The player's Avatar — a divine projection of the chosen Deity
// Deity stays safe in home Realm. Avatar fights on the battlefield.
// God-scale: towers over environment (tiny buildings show scale)
// Death = respawn at home domain (10-20% unspent Belief loss, preserve progression)

class UMGDeityDataAsset;
class UMGCombatComponent;
class UMGBeliefComponent;

UCLASS()
class MYTHOSGATES_API AMGAvatarCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AMGAvatarCharacter();

	// Combat component (handles abilities, auto-attack, cooldowns)
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	UMGCombatComponent* CombatComponent;

	// Belief bar component (charges ultimate)
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	UMGBeliefComponent* BeliefComponent;

	// The deity data this avatar represents
	UPROPERTY(BlueprintReadWrite, Category = "Deity")
	UMGDeityDataAsset* DeityData;

	// Current HP
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float CurrentHP;

	// Max HP (from deity stats)
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float MaxHP;

	// Current Divine Energy (for abilities)
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float CurrentDivineEnergy;

	// Max Divine Energy
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float MaxDivineEnergy = 100.0f;

	// Current faction resource (Solar Charge, Oath Fury, etc.)
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float CurrentFactionResource;

	// Faction resource stacks for passive
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	int32 FactionResourceStacks = 0;

	// Is the avatar dead?
	UFUNCTION(BlueprintPure, Category = "Stats")
	bool IsDead() const { return CurrentHP <= 0.0f; }

	// Take damage with dodge/parry resolution
	UFUNCTION(BlueprintCallable, Category = "Combat")
	virtual float TakeDamageWithResolution(float BaseDamage, float AttackerAccuracy, float AttackerPower);

	// Get the combat role
	UFUNCTION(BlueprintPure, Category = "Deity")
	EMGCombatRole GetCombatRole() const;

	// Get weapon range (for auto-attack)
	UFUNCTION(BlueprintPure, Category = "Combat")
	float GetWeaponRange() const;

	// Heal the avatar
	UFUNCTION(BlueprintCallable, Category = "Combat")
	void Heal(float Amount);

	// Add Divine Energy
	UFUNCTION(BlueprintCallable, Category = "Combat")
	void AddDivineEnergy(float Amount);

	// Add faction resource stacks
	UFUNCTION(BlueprintCallable, Category = "Combat")
	void AddFactionStacks(int32 Amount);

	// Check and trigger faith trigger on victory
	UFUNCTION(BlueprintCallable, Category = "Combat")
	bool CheckFaithTrigger() const;

protected:
	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

private:
	// Auto-attack timer
	float AutoAttackTimer = 0.0f;
	float AutoAttackInterval = 0.5f;

	// Divine Energy regen
	float DivineEnergyRegenRate = 2.0f;
};
