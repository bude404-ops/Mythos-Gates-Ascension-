#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "MGBeliefComponent.generated.h"

// Belief Bar — charges throughout battle from all combat actions
// At 100%, Ultimate/Ascension is unlocked
// Replaces the old Ascension Gauge (v2.0.0)
// Belief is earned from: basic attacks, ability uses, dodges, kills, faith triggers

UENUM(BlueprintType)
enum class EMGBeliefSource : uint8
{
	BasicAttack UMETA(DisplayName = "Basic Attack"),
	AbilityUse UMETA(DisplayName = "Ability Use"),
	Dodge UMETA(DisplayName = "Dodge"),
	EnemyKill UMETA(DisplayName = "Enemy Kill"),
	FaithTrigger UMETA(DisplayName = "Faith Trigger"),
	PassiveProc UMETA(DisplayName = "Passive Proc")
};

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class MYTHOSGATES_API UMGBeliefComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UMGBeliefComponent();

	// Add belief from a combat action
	UFUNCTION(BlueprintCallable, Category = "Belief")
	void AddBelief(float Amount, EMGBeliefSource Source = EMGBeliefSource::BasicAttack);

	// Add belief from killing an enemy
	UFUNCTION(BlueprintCallable, Category = "Belief")
	void AddKillBelief();

	// Add belief from faith trigger (on victory)
	UFUNCTION(BlueprintCallable, Category = "Belief")
	void AddFaithTriggerBelief();

	// Consume the belief bar (when ultimate is used)
	UFUNCTION(BlueprintCallable, Category = "Belief")
	void ConsumeBelief();

	// Check if belief bar is full (ultimate ready)
	UFUNCTION(BlueprintPure, Category = "Belief")
	bool IsBeliefFull() const;

	// Get current belief percentage (0.0 to 1.0)
	UFUNCTION(BlueprintPure, Category = "Belief")
	float GetBeliefPercent() const;

	// Get current belief value
	UFUNCTION(BlueprintPure, Category = "Belief")
	float GetCurrentBelief() const { return CurrentBelief; }

	// Get max belief
	UFUNCTION(BlueprintPure, Category = "Belief")
	float GetMaxBelief() const { return MaxBelief; }

protected:
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
	// Current belief value
	float CurrentBelief = 0.0f;

	// Max belief (100% = ultimate ready)
	float MaxBelief = 100.0f;

	// Belief decay rate (slight decay if not in combat)
	float DecayRate = 0.5f;

	// Time since last combat action
	float TimeSinceLastAction = 0.0f;

	// Decay delay (seconds before belief starts decaying)
	float DecayDelay = 5.0f;

	// Belief values per source
	static constexpr float BeliefPerBasicAttack = 2.0f;
	static constexpr float BeliefPerAbilityUse = 8.0f;
	static constexpr float BeliefPerDodge = 3.0f;
	static constexpr float BeliefPerKill = 10.0f;
	static constexpr float BeliefPerFaithTrigger = 20.0f;
	static constexpr float BeliefPerPassiveProc = 5.0f;
};
