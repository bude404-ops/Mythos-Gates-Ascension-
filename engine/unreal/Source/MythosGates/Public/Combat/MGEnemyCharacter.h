#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MGEnemyCharacter.generated.h"

// Base enemy character for Mythos Gates combat
// Enemies are Hollow-corrupted creatures that fight the Avatar
// 10 AI archetypes: Swarmer, Brute, Hunter, Controller, Disruptor,
//                   Guardian, Executioner, Elite, Champion, EnemyDeity

class AMGEnemyCharacter;

// Delegate for enemy death
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnEnemyDied, AMGEnemyCharacter*, Enemy);

UENUM(BlueprintType)
enum class EMGEnemyArchetype : uint8
{
	Swarmer UMETA(DisplayName = "Swarmer"),
	Brute UMETA(DisplayName = "Brute"),
	Hunter UMETA(DisplayName = "Hunter"),
	Controller UMETA(DisplayName = "Controller"),
	Disruptor UMETA(DisplayName = "Disruptor"),
	Guardian UMETA(DisplayName = "Guardian"),
	Executioner UMETA(DisplayName = "Executioner"),
	Elite UMETA(DisplayName = "Elite"),
	Champion UMETA(DisplayName = "Champion"),
	EnemyDeity UMETA(DisplayName = "Enemy Deity")
};

UCLASS()
class MYTHOSGATES_API AMGEnemyCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AMGEnemyCharacter();

	// Enemy archetype
	UPROPERTY(BlueprintReadWrite, Category = "Enemy")
	EMGEnemyArchetype Archetype = EMGEnemyArchetype::Swarmer;

	// Stats
	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float CurrentHP = 50.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float MaxHP = 50.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float AttackPower = 8.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float Accuracy = 60.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float MoveSpeed = 300.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float AttackRange = 150.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Stats")
	float AttackCooldown = 2.0f;

	// Is the enemy dead?
	UFUNCTION(BlueprintPure, Category = "Stats")
	bool IsDead() const { return CurrentHP <= 0.0f; }

	// Take damage
	UFUNCTION(BlueprintCallable, Category = "Combat")
	virtual void TakeDamage(float Damage);

	// Event fired when enemy dies
	UPROPERTY(BlueprintAssignable, Category = "Events")
	FOnEnemyDied OnEnemyDied;

protected:
	virtual void Tick(float DeltaTime) override;

private:
	// Attack timer
	float AttackTimer = 0.0f;

	// Death handling
	void OnDeath();
};
