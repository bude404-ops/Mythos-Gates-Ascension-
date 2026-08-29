#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "MGCombatSystem.h"
#include "MGCombatComponent.generated.h"

// Core combat component — handles all ability execution, cooldowns, and auto-attack
// Attached to the Avatar character
// Manages: basic attack combo, 3 active abilities, signature, ultimate, passive

class AMGAvatarCharacter;
class AMGEnemyCharacter;

UENUM(BlueprintType)
enum class EMGAbilityState : uint8
{
	Ready UMETA(DisplayName = "Ready"),
	OnCooldown UMETA(DisplayName = "On Cooldown"),
	Active UMETA(DisplayName = "Active"),
	NotEnoughEnergy UMETA(DisplayName = "Not Enough Energy")
};

USTRUCT(BlueprintType)
struct FMGCooldownTimer
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite, Category = "Cooldown")
	float Remaining = 0.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Cooldown")
	float Total = 0.0f;

	bool IsReady() const { return Remaining <= 0.0f; }
	float GetPercentage() const { return Total > 0.0f ? 1.0f - (Remaining / Total) : 1.0f; }
};

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class MYTHOSGATES_API UMGCombatComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UMGCombatComponent();

	// Try to trigger auto-attack (called by Avatar tick when enemy in range)
	UFUNCTION(BlueprintCallable, Category = "Combat")
	bool TryAutoAttack();

	// Trigger ability 1 (short cooldown, low energy)
	UFUNCTION(BlueprintCallable, Category = "Abilities")
	bool TriggerAbility1();

	// Trigger ability 2 (medium cooldown, medium energy)
	UFUNCTION(BlueprintCallable, Category = "Abilities")
	bool TriggerAbility2();

	// Trigger signature (long cooldown, high energy)
	UFUNCTION(BlueprintCallable, Category = "Abilities")
	bool TriggerSignature();

	// Trigger ultimate (requires 100% Belief bar)
	UFUNCTION(BlueprintCallable, Category = "Abilities")
	bool TriggerUltimate();

	// Get ability state (for UI cooldown indicators)
	UFUNCTION(BlueprintPure, Category = "Abilities")
	EMGAbilityState GetAbility1State() const;

	UFUNCTION(BlueprintPure, Category = "Abilities")
	EMGAbilityState GetAbility2State() const;

	UFUNCTION(BlueprintPure, Category = "Abilities")
	EMGAbilityState GetSignatureState() const;

	UFUNCTION(BlueprintPure, Category = "Abilities")
	EMGAbilityState GetUltimateState() const;

	// Get cooldown percentage for UI (0 = ready, 1 = just used)
	UFUNCTION(BlueprintPure, Category = "Abilities")
	float GetAbility1CooldownPercent() const;
	UFUNCTION(BlueprintPure, Category = "Abilities")
	float GetAbility2CooldownPercent() const;
	UFUNCTION(BlueprintPure, Category = "Abilities")
	float GetSignatureCooldownPercent() const;

	// Activate passive empowerment (when faction resource hits 5 stacks)
	UFUNCTION(BlueprintCallable, Category = "Passive")
	void ActivatePassiveEmpowerment();

	// Faith trigger tracking
	UFUNCTION(BlueprintPure, Category = "Faith")
	int32 GetComboChainCount() const { return ComboChainCount; }

	UFUNCTION(BlueprintPure, Category = "Faith")
	int32 GetArmorBreaksCount() const { return ArmorBreaksCount; }

	// Track armor breaks for Assassin faith trigger
	UFUNCTION(BlueprintCallable, Category = "Faith")
	void RegisterArmorBreak() { ArmorBreaksCount++; }

protected:
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;
	virtual void BeginPlay() override;

private:
	// Get the owning avatar
	AMGAvatarCharacter* GetOwnerAvatar() const;

	// Cooldown timers
	FMGCooldownTimer Ability1Cooldown;
	FMGCooldownTimer Ability2Cooldown;
	FMGCooldownTimer SignatureCooldown;
	FMGCooldownTimer UltimateCooldown;

	// Auto-attack combo tracking
	int32 BasicAttackComboStep = 0;
	float BasicAttackComboTimer = 0.0f;
	float BasicAttackComboWindow = 1.5f; // Time window to continue combo

	// Passive empowerment flag
	bool bHasPassiveEmpowerment = false;

	// Faith trigger tracking
	int32 ComboChainCount = 0;
	int32 ArmorBreaksCount = 0;

	// Combo chain tracking (for Caster faith trigger)
	float LastAbilityUseTime = 0.0f;
	float ComboChainWindow = 3.0f; // Time window to chain abilities
	int32 CurrentChainCount = 0;

	// Execute an ability (shared logic)
	bool ExecuteAbility(FMGAbilityData& AbilityData, FMGCooldownTimer& Cooldown);

	// Apply ability effect to target(s)
	void ApplyAbilityEffect(const FMGAbilityData& Ability, AMGEnemyCharacter* Target);

	// Apply ultimate effect (screen-wide — hits ALL enemies)
	void ApplyUltimateEffect(const FMGAbilityData& Ultimate);

	// Get enemies in range of a point
	TArray<AMGEnemyCharacter*> GetEnemiesInRange(const FVector& Center, float Radius);

	// Get enemies in a line
	TArray<AMGEnemyCharacter*> GetEnemiesInLine(const FVector& Start, const FVector& End, float Width);

	// Get enemies in a front cone
	TArray<AMGEnemyCharacter*> GetEnemiesInCone(const FVector& Origin, const FVector& Direction, float Angle, float Range);

	// Get ALL enemies on the battlefield (for ultimate)
	TArray<AMGEnemyCharacter*> GetAllEnemies();
};
