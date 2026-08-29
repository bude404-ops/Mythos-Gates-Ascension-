#pragma once

#include "CoreMinimal.h"
#include "AIController.h"
#include "MGEnemyAIController.generated.h"

// Enemy AI Controller — terrain-aware combat intelligence
// 10 archetypes, each with unique decision loops, target priorities, and tactics
// Enemies exploit ground zones, deny player buffs, bait toward hazards
// Late-game enemies coordinate: pincer, zone traps, ultimate denial, divide-and-conquer

class AMGEnemyCharacter;
class AMGAvatarCharacter;
class AMGGroundEffectZone;

UCLASS()
class MYTHOSGATES_API AMGEnemyAIController : public AAIController
{
	GENERATED_BODY()

public:
	AMGEnemyAIController();

	// Set the archetype (called on spawn)
	UFUNCTION(BlueprintCallable, Category = "AI")
	void SetArchetype(EMGEnemyArchetype NewArchetype);

protected:
	virtual void Tick(float DeltaTime) override;
	virtual void OnPossess(APawn* InPawn) override;

private:
	// The controlled enemy
	AMGEnemyCharacter* ControlledEnemy;

	// The player avatar (target)
	AMGAvatarCharacter* Avatar;

	// AI decision interval (how often the AI re-evaluates)
	float DecisionInterval = 0.5f;
	float DecisionTimer = 0.0f;

	// Attack timing
	float AttackTimer = 0.0f;

	// Current behavioral state
	enum class EAIState
	{
		Idle,
		Seeking,
		Attacking,
		Repositioning,
		Fleeing,
		Guarding
	};

	EAIState CurrentState = EAIState::Idle;

	// Archetype-specific decision loops
	void ExecuteSwarmerAI(float DeltaTime);
	void ExecuteBruteAI(float DeltaTime);
	void ExecuteHunterAI(float DeltaTime);
	void ExecuteControllerAI(float DeltaTime);
	void ExecuteDisruptorAI(float DeltaTime);
	void ExecuteGuardianAI(float DeltaTime);
	void ExecuteExecutionerAI(float DeltaTime);
	void ExecuteEliteAI(float DeltaTime);
	void ExecuteChampionAI(float DeltaTime);
	void ExecuteEnemyDeityAI(float DeltaTime);

	// Shared AI utilities
	void MoveTowardAvatar(float Speed);
	void MoveAwayFromAvatar(float Speed);
	float GetDistanceToAvatar() const;
	bool IsInAttackRange() const;
	bool IsInGroundZone(EMGZoneType ZoneType) const;
	AMGGroundEffectZone* FindNearestZone(EMGZoneType ZoneType) const;
	AMGGroundEffectZone* FindNearestBuffZone() const;
	void TryAttack();

	// Terrain-awareness: check if standing in a hazard zone
	bool IsInHazard() const;

	// Terrain-awareness: find path that avoids hazards
	FVector FindSafePositionNearAvatar(float DesiredDistance) const;

	// Check if avatar's belief bar is near full (for ultimate denial)
	bool IsAvatarBeliefHigh() const;
};
