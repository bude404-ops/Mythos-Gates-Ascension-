#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MGGameMode.generated.h"

// Main game mode for Mythos Gates combat
// Sets up the 2.5D combat plane, spawns deities and enemies, manages victory/defeat
// Camera: ~30-degree overhead angle for tactical clarity + 3D depth

class AMGAvatarCharacter;
class AMGEnemyCharacter;
class AMGGroundEffectZone;

UENUM(BlueprintType)
enum class EMGBattleState : uint8
{
	Setup UMETA(DisplayName = "Setup"),
	Active UMETA(DisplayName = "Active"),
	Victory UMETA(DisplayName = "Victory"),
	Defeat UMETA(DisplayName = "Defeat"),
	Paused UMETA(DisplayName = "Paused")
};

USTRUCT(BlueprintType)
struct FMGWaveDefinition
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite, Category = "Wave")
	TArray<TSubclassOf<AMGEnemyCharacter>> EnemyClasses;

	UPROPERTY(BlueprintReadWrite, Category = "Wave")
	int32 Count = 5;

	UPROPERTY(BlueprintReadWrite, Category = "Wave")
	float SpawnDelay = 2.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Wave")
	bool bIsBossWave = false;
};

UCLASS()
class MYTHOSGATES_API AMGGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AMGGameMode();

	// Called when the battle starts
	UFUNCTION(BlueprintCallable, Category = "Battle")
	void StartBattle();

	// Called when the battle ends
	UFUNCTION(BlueprintCallable, Category = "Battle")
	void EndBattle(bool bVictory);

	// Get current battle state
	UFUNCTION(BlueprintPure, Category = "Battle")
	EMGBattleState GetBattleState() const { return BattleState; }

	// Get the active avatar
	UFUNCTION(BlueprintPure, Category = "Battle")
	AMGAvatarCharacter* GetAvatar() const { return Avatar; }

	// Get all active enemies
	UFUNCTION(BlueprintPure, Category = "Battle")
	TArray<AMGEnemyCharacter*> GetActiveEnemies() const { return ActiveEnemies; }

	// Get all ground effect zones
	UFUNCTION(BlueprintPure, Category = "Battle")
	TArray<AMGGroundEffectZone*> GetGroundZones() const { return GroundZones; }

	// Spawn an enemy at location
	UFUNCTION(BlueprintCallable, Category = "Battle")
	AMGEnemyCharacter* SpawnEnemy(TSubclassOf<AMGEnemyCharacter> EnemyClass, const FVector& Location);

	// Remove a dead enemy
	UFUNCTION(BlueprintCallable, Category = "Battle")
	void RemoveEnemy(AMGEnemyCharacter* Enemy);

	// Check victory/defeat conditions
	UFUNCTION(BlueprintCallable, Category = "Battle")
	void CheckBattleEnd();

protected:
	virtual void BeginPlay() override;
	virtual void Tick(float DeltaTime) override;

	// Set up the 2.5D combat plane
	void SetupCombatPlane();

	// Set up camera at ~30 degree overhead
	void SetupCamera();

	// Spawn initial ground effect zones based on faction
	void SpawnGroundZones();

	// Spawn enemy waves
	void SpawnWaves();

	// Wave management
	int32 CurrentWaveIndex;
	float WaveSpawnTimer;
	bool bWaveSpawnPending;

private:
	// Battle state
	EMGBattleState BattleState = EMGBattleState::Setup;

	// The player's avatar
	UPROPERTY()
	AMGAvatarCharacter* Avatar;

	// Active enemies on the battlefield
	UPROPERTY()
	TArray<AMGEnemyCharacter*> ActiveEnemies;

	// Ground effect zones
	UPROPERTY()
	TArray<AMGGroundEffectZone*> GroundZones;

	// Wave definitions for this battle
	UPROPERTY()
	TArray<FMGWaveDefinition> Waves;

	// Battlefield bounds (2.5D plane)
	float BattlefieldWidth = 4000.0f;
	float BattlefieldDepth = 2500.0f;

	// Realm advantage modifiers
	struct FRealmModifiers
	{
		float AttackMod = 0.0f;
		float DefenseMod = 0.0f;
		float CooldownMod = 0.0f;
	};

	FRealmModifiers CurrentRealmModifiers;
};
