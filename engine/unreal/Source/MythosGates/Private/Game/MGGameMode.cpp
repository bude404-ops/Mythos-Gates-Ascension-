#include "MGGameMode.h"
#include "Engine/World.h"
#include "GameFramework/PlayerController.h"
#include "Kismet/GameplayStatics.h"
#include "Combat/MGAvatarCharacter.h"
#include "Combat/MGEnemyCharacter.h"
#include "Combat/MGGroundEffectZone.h"

AMGGameMode::AMGGameMode()
{
	CurrentWaveIndex = 0;
	WaveSpawnTimer = 0.0f;
	bWaveSpawnPending = false;
}

void AMGGameMode::BeginPlay()
{
	Super::BeginPlay();

	SetupCombatPlane();
	SetupCamera();
	SpawnGroundZones();
}

void AMGGameMode::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (BattleState != EMGBattleState::Active)
		return;

	// Wave spawning logic
	if (bWaveSpawnPending)
	{
		WaveSpawnTimer -= DeltaTime;
		if (WaveSpawnTimer <= 0.0f)
		{
			SpawnWaves();
			bWaveSpawnPending = false;
		}
	}

	// Check if current wave is cleared
	if (!bWaveSpawnPending && ActiveEnemies.Num() == 0 && CurrentWaveIndex < Waves.Num())
	{
		CurrentWaveIndex++;
		if (CurrentWaveIndex < Waves.Num())
		{
			bWaveSpawnPending = true;
			WaveSpawnTimer = Waves[CurrentWaveIndex].SpawnDelay;
		}
		else
		{
			// All waves cleared — victory
			EndBattle(true);
		}
	}

	// Check defeat
	if (Avatar && Avatar->IsDead())
	{
		EndBattle(false);
	}
}

void AMGGameMode::StartBattle()
{
	BattleState = EMGBattleState::Active;
	CurrentWaveIndex = 0;
	bWaveSpawnPending = true;
	WaveSpawnTimer = 3.0f; // Initial delay before first wave
}

void AMGGameMode::EndBattle(bool bVictory)
{
	BattleState = bVictory ? EMGBattleState::Victory : EMGBattleState::Defeat;

	// TODO: Trigger victory/defeat UI, calculate rewards, save progress
	// Victory: Award Belief, Sunshards, GateKeys, XP
	// Defeat: 10-20% unspent Belief loss, preserve level/abilities/relics
}

void AMGGameMode::SetupCombatPlane()
{
	// 2.5D combat plane — flat plane with 3D terrain for visual depth
	// Battlefield bounds define the playable area
	// Tiny human-sized buildings scattered to show god-scale
}

void AMGGameMode::SetupCamera()
{
	// ~30 degree overhead angle
	// Flat enough for tactical clarity, angled enough to sell 3D depth
	if (APlayerController* PC = GetWorld()->GetFirstPlayerController())
	{
		// TODO: Set camera to fixed overhead angle with slight tilt
		// Camera should NOT follow avatar — shows full battlefield
	}
}

void AMGGameMode::SpawnGroundZones()
{
	// Spawn faction-specific ground effect zones based on battlefield faction
	// Types: Damage, Buff, Debuff, Hazard
	// Layout is unique per battlefield based on faction terrain
}

void AMGGameMode::SpawnWaves()
{
	if (CurrentWaveIndex >= Waves.Num())
		return;

	const FMGWaveDefinition& Wave = Waves[CurrentWaveIndex];

	for (int32 i = 0; i < Wave.Count; i++)
	{
		// Spawn enemies at random positions within battlefield bounds
		float X = FMath::RandRange(-BattlefieldWidth / 2, BattlefieldWidth / 2);
		float Y = FMath::RandRange(BattlefieldDepth / 4, BattlefieldDepth / 2); // Spawn from far edge

		if (Wave.EnemyClasses.Num() > 0)
		{
			int32 ClassIndex = FMath::RandRange(0, Wave.EnemyClasses.Num() - 1);
			SpawnEnemy(Wave.EnemyClasses[ClassIndex], FVector(X, Y, 0.0f));
		}
	}
}

AMGEnemyCharacter* AMGGameMode::SpawnEnemy(TSubclassOf<AMGEnemyCharacter> EnemyClass, const FVector& Location)
{
	if (!EnemyClass)
		return nullptr;

	FActorSpawnParameters SpawnParams;
	SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AdjustIfPossibleButAlwaysSpawn;

	AMGEnemyCharacter* Enemy = GetWorld()->SpawnActor<AMGEnemyCharacter>(EnemyClass, Location, FRotator::ZeroRotator, SpawnParams);

	if (Enemy)
	{
		ActiveEnemies.Add(Enemy);
	}

	return Enemy;
}

void AMGGameMode::RemoveEnemy(AMGEnemyCharacter* Enemy)
{
	if (Enemy)
	{
		ActiveEnemies.Remove(Enemy);
	}
}

void AMGGameMode::CheckBattleEnd()
{
	if (BattleState != EMGBattleState::Active)
		return;

	// Defeat: avatar is dead
	if (Avatar && Avatar->IsDead())
	{
		EndBattle(false);
		return;
	}

	// Victory: all waves cleared and no enemies remaining
	if (!bWaveSpawnPending && ActiveEnemies.Num() == 0 && CurrentWaveIndex >= Waves.Num())
	{
		EndBattle(true);
	}
}
