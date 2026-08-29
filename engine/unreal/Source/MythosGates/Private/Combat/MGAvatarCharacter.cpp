#include "MGAvatarCharacter.h"
#include "MGCombatComponent.h"
#include "MGBeliefComponent.h"
#include "MGDodgeParryResolver.h"
#include "Data/MGDeityDataAsset.h"
#include "Engine/World.h"

AMGAvatarCharacter::AMGAvatarCharacter()
{
	// Create combat component
	CombatComponent = CreateDefaultSubobject<UMGCombatComponent>(TEXT("CombatComponent"));

	// Create belief component
	BeliefComponent = CreateDefaultSubobject<UMGBeliefComponent>(TEXT("BeliefComponent"));

	// Don't use default UE controller rotation
	bUseControllerRotationYaw = false;
}

void AMGAvatarCharacter::BeginPlay()
{
	Super::BeginPlay();

	if (DeityData)
	{
		// Use progression-scaled stats based on deity level
		int32 Level = DeityData->Stats.Level > 0 ? DeityData->Stats.Level : 1;
		MaxHP = DeityData->Stats.GetScaledHP() * 10.0f; // Scale for game feel
		CurrentHP = MaxHP;
		MaxDivineEnergy = 100.0f;
		CurrentDivineEnergy = 50.0f; // Start with half energy
		CurrentFactionResource = 0.0f;
	}
}

void AMGAvatarCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (IsDead())
		return;

	// Divine Energy passive regen
	AddDivineEnergy(DivineEnergyRegenRate * DeltaTime);

	// Auto-attack check — triggers when enemy is within weapon range
	AutoAttackTimer += DeltaTime;
	if (AutoAttackTimer >= AutoAttackInterval)
	{
		AutoAttackTimer = 0.0f;

		// TODO: Check for enemies in weapon range via sphere trace
		// If enemy found, trigger basic attack (free, no input needed)
		if (CombatComponent)
		{
			CombatComponent->TryAutoAttack();
		}
	}
}

void AMGAvatarCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	// Ability buttons
	PlayerInputComponent->BindAction("Ability1", IE_Pressed, this, &AMGAvatarCharacter::);
	// Abilities are handled by CombatComponent through the player controller
}

float AMGAvatarCharacter::TakeDamageWithResolution(float BaseDamage, float AttackerAccuracy, float AttackerPower)
{
	if (IsDead() || !DeityData)
		return 0.0f;

	// Auto-resolve dodge/parry (uses progression-scaled stats)
	float DamageMultiplier = UMGDodgeParryResolver::ResolveAttack(
		AttackerAccuracy,
		AttackerPower,
		DeityData->Stats.GetScaledDodge(),
		DeityData->Stats.GetScaledParry()
	);

	float FinalDamage = BaseDamage * DamageMultiplier;

	// Apply armor reduction (uses progression-scaled defense)
	float ArmorReduction = DeityData->Stats.GetArmorReduction();
	FinalDamage *= (1.0f - ArmorReduction);

	CurrentHP -= FinalDamage;

	if (CurrentHP <= 0.0f)
	{
		CurrentHP = 0.0f;
		// Avatar dies — trigger death sequence
		// Deity is safe, only the projection falls
	}

	// Gain Divine Energy from taking damage (rage mechanic)
	AddDivineEnergy(FinalDamage * 0.5f);

	return FinalDamage;
}

EMGCombatRole AMGAvatarCharacter::GetCombatRole() const
{
	if (DeityData)
		return DeityData->CombatRole;
	return EMGCombatRole::Warrior;
}

float AMGAvatarCharacter::GetWeaponRange() const
{
	if (DeityData)
		return DeityData->Stats.GetScaledSpeed() * 100.0f; // Scale to UE5 units
	return 200.0f;
}

void AMGAvatarCharacter::Heal(float Amount)
{
	CurrentHP = FMath::Min(CurrentHP + Amount, MaxHP);
}

void AMGAvatarCharacter::AddDivineEnergy(float Amount)
{
	CurrentDivineEnergy = FMath::Clamp(CurrentDivineEnergy + Amount, 0.0f, MaxDivineEnergy);
}

void AMGAvatarCharacter::AddFactionStacks(int32 Amount)
{
	FactionResourceStacks += Amount;

	// At 5 stacks, empower next ability or attack (passive trigger)
	if (FactionResourceStacks >= 5)
	{
		if (CombatComponent)
		{
			CombatComponent->ActivatePassiveEmpowerment();
		}
		FactionResourceStacks = 0; // Reset after empowerment
	}
}

bool AMGAvatarCharacter::CheckFaithTrigger() const
{
	if (!DeityData)
		return false;

	switch (DeityData->CombatRole)
	{
	case EMGCombatRole::Warrior:
		// Win while staying above 50% HP the entire fight
		return (CurrentHP / MaxHP) > 0.5f;

	case EMGCombatRole::Caster:
		// Win after executing 3+ ability combo chains
		// Tracked by CombatComponent
		return CombatComponent ? CombatComponent->GetComboChainCount() >= 3 : false;

	case EMGCombatRole::Archer:
		// Win while controlling 60%+ of battlefield nodes
		// Tracked by GameMode ground zone control
		// TODO: Query GameMode for zone control percentage
		return false; // Placeholder

	case EMGCombatRole::Assassin:
		// Win after breaking 3+ enemy armor/defense stacks
		return CombatComponent ? CombatComponent->GetArmorBreaksCount() >= 3 : false;

	default:
		return false;
	}
}
