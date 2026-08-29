#include "MGCombatComponent.h"
#include "MGAvatarCharacter.h"
#include "MGEnemyCharacter.h"
#include "MGBeliefComponent.h"
#include "Data/MGDeityDataAsset.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"

UMGCombatComponent::UMGCombatComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
}

void UMGCombatComponent::BeginPlay()
{
	Super::BeginPlay();
}

void UMGCombatComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	// Tick down cooldowns
	if (!Ability1Cooldown.IsReady())
		Ability1Cooldown.Remaining -= DeltaTime;

	if (!Ability2Cooldown.IsReady())
		Ability2Cooldown.Remaining -= DeltaTime;

	if (!SignatureCooldown.IsReady())
		SignatureCooldown.Remaining -= DeltaTime;

	if (!UltimateCooldown.IsReady())
		UltimateCooldown.Remaining -= DeltaTime;

	// Tick combo timer
	BasicAttackComboTimer -= DeltaTime;
	if (BasicAttackComboTimer <= 0.0f)
	{
		BasicAttackComboStep = 0; // Reset combo if window expired
	}

	// Tick combo chain timer (Caster faith trigger)
	if (CurrentChainCount > 0)
	{
		LastAbilityUseTime += DeltaTime;
		if (LastAbilityUseTime >= ComboChainWindow)
		{
			CurrentChainCount = 0; // Chain broken
		}
	}
}

AMGAvatarCharacter* UMGCombatComponent::GetOwnerAvatar() const
{
	return Cast<AMGAvatarCharacter>(GetOwner());
}

bool UMGCombatComponent::TryAutoAttack()
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || Avatar->IsDead() || !Avatar->DeityData)
		return false;

	// Find enemies in weapon range
	float Range = Avatar->GetWeaponRange();
	TArray<AMGEnemyCharacter*> Enemies = GetEnemiesInRange(Avatar->GetActorLocation(), Range);

	if (Enemies.Num() == 0)
		return false; // No enemy in range — avatar stands idle

	// Execute basic attack (free, no cooldown, no energy cost)
	// Builds Divine Energy
	BasicAttackComboStep++;
	if (BasicAttackComboStep > 3)
		BasicAttackComboStep = 1; // Loop combo chain

	BasicAttackComboTimer = BasicAttackComboWindow;

	// Hit the closest enemy
	AMGEnemyCharacter* Target = Enemies[0];
	if (Target)
	{
		// Apply basic attack damage
		float Damage = Avatar->DeityData->Stats.Attack;

		// Third hit in combo chain gets bonus
		if (BasicAttackComboStep == 3)
		{
			Damage *= 1.5f; // Third hit bonus
		}

		// Passive empowerment bonus
		if (bHasPassiveEmpowerment)
		{
			Damage *= 2.0f;
			bHasPassiveEmpowerment = false;
		}

		Target->TakeDamage(Damage);

		// Build Divine Energy from basic attack
		Avatar->AddDivineEnergy(5.0f);

		// Build belief
		if (Avatar->BeliefComponent)
		{
			Avatar->BeliefComponent->AddBelief(2.0f);
		}

		// Build faction resource stacks
		Avatar->AddFactionStacks(1);
	}

	return true;
}

bool UMGCombatComponent::TriggerAbility1()
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || !Avatar->DeityData)
		return false;

	// Check cooldown
	if (!Ability1Cooldown.IsReady())
		return false;

	// Check energy
	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Ability1.EnergyCost)
		return false;

	return ExecuteAbility(Avatar->DeityData->Ability1, Ability1Cooldown);
}

bool UMGCombatComponent::TriggerAbility2()
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || !Avatar->DeityData)
		return false;

	if (!Ability2Cooldown.IsReady())
		return false;

	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Ability2.EnergyCost)
		return false;

	return ExecuteAbility(Avatar->DeityData->Ability2, Ability2Cooldown);
}

bool UMGCombatComponent::TriggerSignature()
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || !Avatar->DeityData)
		return false;

	if (!SignatureCooldown.IsReady())
		return false;

	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Signature.EnergyCost)
		return false;

	return ExecuteAbility(Avatar->DeityData->Signature, SignatureCooldown);
}

bool UMGCombatComponent::TriggerUltimate()
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || !Avatar->DeityData)
		return false;

	// Check belief bar — must be at 100%
	if (!Avatar->BeliefComponent || !Avatar->BeliefComponent->IsBeliefFull())
		return false;

	// Ultimate has no energy cost, uses belief instead
	if (!UltimateCooldown.IsReady())
		return false;

	// Consume belief bar
	Avatar->BeliefComponent->ConsumeBelief();

	// Execute ultimate — hits ALL enemies on screen
	ApplyUltimateEffect(Avatar->DeityData->Ultimate);

	// Set cooldown (ultimate is once per battle)
	UltimateCooldown.Total = 9999.0f;
	UltimateCooldown.Remaining = 9999.0f;

	return true;
}

bool UMGCombatComponent::ExecuteAbility(FMGAbilityData& AbilityData, FMGCooldownTimer& Cooldown)
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar)
		return false;

	// Spend Divine Energy
	Avatar->CurrentDivineEnergy -= AbilityData.EnergyCost;

	// Set cooldown
	Cooldown.Total = AbilityData.Cooldown;
	Cooldown.Remaining = AbilityData.Cooldown;

	// Track combo chain (Caster faith trigger)
	LastAbilityUseTime = 0.0f;
	CurrentChainCount++;
	if (CurrentChainCount >= 3)
	{
		ComboChainCount++; // Register a completed combo chain
		CurrentChainCount = 0;
	}

	// Build belief from ability use
	if (Avatar->BeliefComponent)
	{
		Avatar->BeliefComponent->AddBelief(8.0f);
	}

	// TODO: Determine ability type from AbilityData and apply effect
	// Types: SingleTarget, Cleave, AoE, Line, Ultimate
	// For now, apply to closest enemy as basic damage
	TArray<AMGEnemyCharacter*> Enemies = GetEnemiesInRange(Avatar->GetActorLocation(), 500.0f);

	float AbilityDamage = Avatar->DeityData->Stats.Attack * 3.0f; // Abilities hit harder than basics

	// Passive empowerment
	if (bHasPassiveEmpowerment)
	{
		AbilityDamage *= 2.0f;
		bHasPassiveEmpowerment = false;
	}

	for (AMGEnemyCharacter* Enemy : Enemies)
	{
		if (Enemy)
		{
			Enemy->TakeDamage(AbilityDamage);
		}
	}

	return true;
}

void UMGCombatComponent::ApplyAbilityEffect(const FMGAbilityData& Ability, AMGEnemyCharacter* Target)
{
	if (!Target)
		return;

	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar)
		return;

	float Damage = Avatar->DeityData->Stats.Attack * 3.0f;
	Target->TakeDamage(Damage);
}

void UMGCombatComponent::ApplyUltimateEffect(const FMGAbilityData& Ultimate)
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar)
		return;

	// Ultimate hits ALL enemies on the battlefield
	TArray<AMGEnemyCharacter*> AllEnemies = GetAllEnemies();

	float UltimateDamage = Avatar->DeityData->Stats.Attack * 10.0f; // Ultimate hits very hard

	for (AMGEnemyCharacter* Enemy : AllEnemies)
	{
		if (Enemy)
		{
			Enemy->TakeDamage(UltimateDamage);
		}
	}

	// TODO: Apply ultimate-specific effects (blinds, stuns, freezes, etc.)
	// These are defined per deity in the ability data
}

void UMGCombatComponent::ActivatePassiveEmpowerment()
{
	bHasPassiveEmpowerment = true;
	// Next ability or attack deals 2x damage
}

EMGAbilityState UMGCombatComponent::GetAbility1State() const
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar) return EMGAbilityState::NotEnoughEnergy;
	if (!Ability1Cooldown.IsReady()) return EMGAbilityState::OnCooldown;
	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Ability1.EnergyCost) return EMGAbilityState::NotEnoughEnergy;
	return EMGAbilityState::Ready;
}

EMGAbilityState UMGCombatComponent::GetAbility2State() const
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar) return EMGAbilityState::NotEnoughEnergy;
	if (!Ability2Cooldown.IsReady()) return EMGAbilityState::OnCooldown;
	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Ability2.EnergyCost) return EMGAbilityState::NotEnoughEnergy;
	return EMGAbilityState::Ready;
}

EMGAbilityState UMGCombatComponent::GetSignatureState() const
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar) return EMGAbilityState::NotEnoughEnergy;
	if (!SignatureCooldown.IsReady()) return EMGAbilityState::OnCooldown;
	if (Avatar->CurrentDivineEnergy < Avatar->DeityData->Signature.EnergyCost) return EMGAbilityState::NotEnoughEnergy;
	return EMGAbilityState::Ready;
}

EMGAbilityState UMGCombatComponent::GetUltimateState() const
{
	AMGAvatarCharacter* Avatar = GetOwnerAvatar();
	if (!Avatar || !Avatar->BeliefComponent) return EMGAbilityState::NotEnoughEnergy;
	if (!UltimateCooldown.IsReady()) return EMGAbilityState::OnCooldown;
	if (!Avatar->BeliefComponent->IsBeliefFull()) return EMGAbilityState::NotEnoughEnergy;
	return EMGAbilityState::Ready;
}

float UMGCombatComponent::GetAbility1CooldownPercent() const
{
	return Ability1Cooldown.GetPercentage();
}

float UMGCombatComponent::GetAbility2CooldownPercent() const
{
	return Ability2Cooldown.GetPercentage();
}

float UMGCombatComponent::GetSignatureCooldownPercent() const
{
	return SignatureCooldown.GetPercentage();
}

TArray<AMGEnemyCharacter*> UMGCombatComponent::GetEnemiesInRange(const FVector& Center, float Radius)
{
	TArray<AMGEnemyCharacter*> Result;

	// TODO: Use sphere overlap to find enemies
	// For now, query all actors of class AMGEnemyCharacter
	TArray<AActor*> AllEnemies;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGEnemyCharacter::StaticClass(), AllEnemies);

	for (AActor* Actor : AllEnemies)
	{
		if (AMGEnemyCharacter* Enemy = Cast<AMGEnemyCharacter>(Actor))
		{
			float Dist = FVector::Dist(Center, Enemy->GetActorLocation());
			if (Dist <= Radius && !Enemy->IsDead())
			{
				Result.Add(Enemy);
			}
		}
	}

	return Result;
}

TArray<AMGEnemyCharacter*> UMGCombatComponent::GetEnemiesInLine(const FVector& Start, const FVector& End, float Width)
{
	TArray<AMGEnemyCharacter*> Result;

	TArray<AActor*> AllEnemies;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGEnemyCharacter::StaticClass(), AllEnemies);

	for (AActor* Actor : AllEnemies)
	{
		if (AMGEnemyCharacter* Enemy = Cast<AMGEnemyCharacter>(Actor))
		{
			if (Enemy->IsDead()) continue;

			FVector ClosestPoint = FMath::ClosestPointOnSegment(Enemy->GetActorLocation(), Start, End);
			float Dist = FVector::Dist(Enemy->GetActorLocation(), ClosestPoint);
			if (Dist <= Width)
			{
				Result.Add(Enemy);
			}
		}
	}

	return Result;
}

TArray<AMGEnemyCharacter*> UMGCombatComponent::GetEnemiesInCone(const FVector& Origin, const FVector& Direction, float Angle, float Range)
{
	TArray<AMGEnemyCharacter*> Result;

	TArray<AActor*> AllEnemies;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGEnemyCharacter::StaticClass(), AllEnemies);

	FVector NormalDir = Direction.GetSafeNormal();

	for (AActor* Actor : AllEnemies)
	{
		if (AMGEnemyCharacter* Enemy = Cast<AMGEnemyCharacter>(Actor))
		{
			if (Enemy->IsDead()) continue;

			FVector ToEnemy = (Enemy->GetActorLocation() - Origin).GetSafeNormal();
			float DotProduct = FVector::DotProduct(NormalDir, ToEnemy);
			float AngleToEnemy = FMath::Acos(DotProduct);

			float Dist = FVector::Dist(Origin, Enemy->GetActorLocation());

			if (AngleToEnemy <= FMath::DegreesToRadians(Angle) && Dist <= Range)
			{
				Result.Add(Enemy);
			}
		}
	}

	return Result;
}

TArray<AMGEnemyCharacter*> UMGCombatComponent::GetAllEnemies()
{
	TArray<AMGEnemyCharacter*> Result;

	TArray<AActor*> AllEnemies;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGEnemyCharacter::StaticClass(), AllEnemies);

	for (AActor* Actor : AllEnemies)
	{
		if (AMGEnemyCharacter* Enemy = Cast<AMGEnemyCharacter>(Actor))
		{
			if (!Enemy->IsDead())
			{
				Result.Add(Enemy);
			}
		}
	}

	return Result;
}
