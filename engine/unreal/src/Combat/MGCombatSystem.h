// Mythos Gates: Ascension — Combat System Header
// UE5 Mobile-First 2.5D Combat Implementation
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MGCombatSystem.generated.h"

// === ENUMERATIONS ===

UENUM(BlueprintType)
enum class ECombatRole : uint8
{
    Endurance UMETA(DisplayName = "Endurance"),
    Conduit UMETA(DisplayName = "Conduit"),
    Dominion UMETA(DisplayName = "Dominion"),
    Fracture UMETA(DisplayName = "Fracture")
};

UENUM(BlueprintType)
enum class ECombatPhase : uint8
{
    Explore UMETA(DisplayName = "Explore"),
    Encounter UMETA(DisplayName = "Encounter"),
    Combat UMETA(DisplayName = "1 Deity vs Multiple Enemies"),
    Victory UMETA(DisplayName = "Victory"),
    Rewards UMETA(DisplayName = "Rewards"),
    Upgrade UMETA(DisplayName = "Upgrade Deity"),
    ExploreFurther UMETA(DisplayName = "Explore Further")
};

UENUM(BlueprintType)
enum class EEnemyArchetype : uint8
{
    Swarm UMETA(DisplayName = "Swarm"),
    Brute UMETA(DisplayName = "Brute"),
    Sniper UMETA(DisplayName = "Sniper"),
    Commander UMETA(DisplayName = "Commander"),
    Assassin UMETA(DisplayName = "Assassin")
};

// === STRUCTURES ===

USTRUCT(BlueprintType)
struct FDeityStats
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float HP = 17500.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float DEF = 400.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float ATK = 380.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float DivineEnergy = 200.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float Speed = 4.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float CritRate = 0.05f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float Penetration = 50.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float Recovery = 25.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    float AreaRadius = 3.0f;
};

USTRUCT(BlueprintType)
struct FAbilityKit
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Abilities")
    FString Passive;

    UPROPERTY(BlueprintReadWrite, Category = "Abilities")
    FString Active1;

    UPROPERTY(BlueprintReadWrite, Category = "Abilities")
    FString Active2;

    UPROPERTY(BlueprintReadWrite, Category = "Abilities")
    FString Active3;

    UPROPERTY(BlueprintReadWrite, Category = "Abilities")
    FString Ultimate;
};

USTRUCT(BlueprintType)
struct FWeaponAscension
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Weapon")
    FString WeaponName;

    UPROPERTY(BlueprintReadWrite, Category = "Weapon")
    int32 Level = 1;

    // 3 choices every 5 levels → 243 total builds
    UPROPERTY(BlueprintReadWrite, Category = "Weapon")
    TArray<FString> AscensionPath;

    UPROPERTY(BlueprintReadWrite, Category = "Weapon")
    TArray<FString> AvailableUpgrades; // 3 choices at each milestone
};

// === CORE CLASSES ===

UCLASS(BlueprintType, Blueprintable)
class AMGDeityAvatar : public ACharacter
{
    GENERATED_BODY()

public:
    AMGDeityAvatar();

    // Combat identity
    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FString DeityId;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FString DeityName;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FString Faction;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    ECombatRole CombatRole;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FDeityStats Stats;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FAbilityKit Abilities;

    UPROPERTY(BlueprintReadWrite, Category = "Deity")
    FWeaponAscension Weapon;

    // Belief system (charges ultimate)
    UPROPERTY(BlueprintReadWrite, Category = "Belief")
    float CurrentBelief = 0.0f;

    UPROPERTY(BlueprintReadWrite, Category = "Belief")
    float MaxBelief = 145.0f;

    // Combat functions
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void AutoAttack(class AMGEnemy* Target);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void ActivateAbility(int32 AbilityIndex);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void ActivateUltimate();

    UFUNCTION(BlueprintCallable, Category = "Combat")
    bool TryParry(float AttackerSpeed);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    bool TryDodge(float AttackerSpeed);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void TakeDamage(float Damage, float AttackerPenetration);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void GainBelief(float Amount);

protected:
    virtual void BeginPlay() override;
};

UCLASS(BlueprintType, Blueprintable)
class AMGEnemy : public ACharacter
{
    GENERATED_BODY()

public:
    AMGEnemy();

    UPROPERTY(BlueprintReadWrite, Category = "Enemy")
    FString EnemyId;

    UPROPERTY(BlueprintReadWrite, Category = "Enemy")
    FString EnemyName;

    UPROPERTY(BlueprintReadWrite, Category = "Enemy")
    EEnemyArchetype Archetype;

    UPROPERTY(BlueprintReadWrite, Category = "Enemy")
    FDeityStats Stats;

    // AI functions
    UFUNCTION(BlueprintCallable, Category = "AI")
    void ExecuteAITurn(class AMGDeityAvatar* Player);

    UFUNCTION(BlueprintCallable, Category = "AI")
    bool IsTerrainAware();

protected:
    virtual void BeginPlay() override;
};

UCLASS(BlueprintType, Blueprintable)
class AMGCombatManager : public AActor
{
    GENERATED_BODY()

public:
    AMGCombatManager();

    // Combat state
    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    ECombatPhase CurrentPhase;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    TArray<AMGEnemy*> ActiveEnemies;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    AMGDeityAvatar* PlayerDeity;

    // Phase management
    UFUNCTION(BlueprintCallable, Category = "Combat")
    void StartEncounter();

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void EndCombat(bool bVictory);

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void AdvancePhase();

    // Mobile-optimized combat
    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    int32 MaxEnemiesStandard = 6;

    UPROPERTY(BlueprintReadWrite, Category = "Combat")
    int32 MaxEnemiesBoss = 4;

protected:
    virtual void BeginPlay() override;
};
