#include "MGAnimInstance.h"
#include "Combat/MGAvatarCharacter.h"
#include "Combat/MGCombatComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Animation/AnimMontage.h"

UMGAnimInstance::UMGAnimInstance()
{
}

void UMGAnimInstance::NativeUpdateAnimation(float DeltaTimeX)
{
	Super::NativeUpdateAnimation(DeltaTimeX);

	AMGAvatarCharacter* Avatar = GetOwningAvatar();
	if (!Avatar)
		return;

	// Update movement data for blend spaces
	if (UCharacterMovementComponent* MoveComp = Avatar->GetCharacterMovement())
	{
		MovementSpeed = MoveComp->Velocity.Size();
		MovementDirection = Avatar->GetActorRotation().Yaw;
	}

	// Update combat state
	bInCombat = (Avatar->CurrentDivineEnergy > 0.0f);
	bIsDead = Avatar->IsDead();

	// Update combo step from combat component
	if (UMGCombatComponent* Combat = GetCombatComponent())
	{
		// Combo step tracking is managed by combat component
	}

	// Handle combo timeout
	if (ComboStep > 0)
	{
		ComboTimeoutTimer += DeltaTimeX;
		if (ComboTimeoutTimer >= ComboTimeoutWindow)
		{
			ComboStep = 0;
			CurrentState = EMGAnimState::Idle;
		}
	}

	// Process state machine
	if (bIsDead)
	{
		if (CurrentState != EMGAnimState::Death)
		{
			CurrentState = EMGAnimState::Death;
			PlayDeath();
		}
		return;
	}

	// Check for pending reaction (auto-resolved dodge/parry/hit)
	if (bReactionPending)
	{
		bReactionPending = false;
		PreviousState = CurrentState;
		CurrentState = PendingReaction;
		PlayMontageSection(PendingReaction);
		return;
	}

	// Update locomotion (only if not in combat animation)
	switch (CurrentState)
	{
	case EMGAnimState::Idle:
	case EMGAnimState::Walk:
		UpdateLocomotionState();
		break;
	case EMGAnimState::BasicAttack1:
	case EMGAnimState::BasicAttack2:
	case EMGAnimState::BasicAttack3:
	case EMGAnimState::Ability1:
	case EMGAnimState::Ability2:
	case EMGAnimState::Signature:
	case EMGAnimState::Ultimate:
	case EMGAnimState::DodgeDash:
		// Combat animations play to completion, then return to idle
		if (!IsAnyMontagePlaying())
		{
			CurrentState = EMGAnimState::Idle;
		}
		break;
	case EMGAnimState::DodgeEvade:
	case EMGAnimState::ParryBlock:
	case EMGAnimState::HitReact:
		// Reaction animations are very short, return to previous state
		if (!IsAnyMontagePlaying())
		{
			CurrentState = PreviousState;
		}
		break;
	case EMGAnimState::Spawn:
		if (!IsAnyMontagePlaying())
		{
			CurrentState = EMGAnimState::Idle;
		}
		break;
	case EMGAnimState::Death:
	case EMGAnimState::Respawn:
		break;
	}
}

void UMGAnimInstance::SetWeaponAnimClass(EMGWeaponAnimClass NewClass)
{
	WeaponClass = NewClass;
}

void UMGAnimInstance::PlayCombatAnim(EMGAnimState CombatState)
{
	if (bIsDead)
		return;

	PreviousState = CurrentState;
	CurrentState = CombatState;

	// Track combo step
	if (CombatState == EMGAnimState::BasicAttack1)
	{
		ComboStep = 1;
		ComboTimeoutTimer = 0.0f;
	}
	else if (CombatState == EMGAnimState::BasicAttack2)
	{
		ComboStep = 2;
		ComboTimeoutTimer = 0.0f;
	}
	else if (CombatState == EMGAnimState::BasicAttack3)
	{
		ComboStep = 3;
		ComboTimeoutTimer = 0.0f;
	}
	else
	{
		// Ability interrupted the combo
		ComboStep = 0;
	}

	PlayMontageSection(CombatState);
}

void UMGAnimInstance::PlayReactionAnim(EMGAnimState ReactionState)
{
	bReactionPending = true;
	PendingReaction = ReactionState;
}

void UMGAnimInstance::PlayDodgeDash()
{
	if (bIsDead)
		return;

	PreviousState = CurrentState;
	CurrentState = EMGAnimState::DodgeDash;
	PlayMontageSection(EMGAnimState::DodgeDash);
}

void UMGAnimInstance::PlayDeath()
{
	CurrentState = EMGAnimState::Death;
	PlayMontageSection(EMGAnimState::Death);
}

void UMGAnimInstance::PlaySpawn()
{
	CurrentState = EMGAnimState::Spawn;
	PlayMontageSection(EMGAnimState::Spawn);
}

void UMGAnimInstance::UpdateLocomotionState()
{
	if (MovementSpeed > 10.0f)
	{
		CurrentState = EMGAnimState::Walk;
	}
	else
	{
		CurrentState = EMGAnimState::Idle;
	}
}

void UMGAnimInstance::PlayMontageSection(EMGAnimState State)
{
	// Get the montage for the current weapon class
	UAnimMontage** MontagePtr = WeaponMontages.Find(WeaponClass);
	if (!MontagePtr || !*MontagePtr)
		return;

	UAnimMontage* Montage = *MontagePtr;
	FName SectionName = GetSectionName(State);

	if (!Montage->IsValidSectionName(SectionName))
		return;

	// Stop any currently playing montage
	StopAllMontages(0.05f);

	// Play the section
	PlayMontage(Montage, 1.0f, SectionName);
}

FName UMGAnimInstance::GetSectionName(EMGAnimState State) const
{
	switch (State)
	{
	case EMGAnimState::BasicAttack1: return FName("BasicAttack_1");
	case EMGAnimState::BasicAttack2: return FName("BasicAttack_2");
	case EMGAnimState::BasicAttack3: return FName("BasicAttack_3");
	case EMGAnimState::Ability1: return FName("Ability1");
	case EMGAnimState::Ability2: return FName("Ability2");
	case EMGAnimState::Signature: return FName("Signature");
	case EMGAnimState::Ultimate: return FName("Ultimate");
	case EMGAnimState::DodgeEvade: return FName("DodgeEvade");
	case EMGAnimState::ParryBlock: return FName("ParryBlock");
	case EMGAnimState::HitReact: return FName("HitReact");
	case EMGAnimState::DodgeDash: return FName("DodgeDash");
	case EMGAnimState::Death: return FName("Death");
	case EMGAnimState::Spawn: return FName("Spawn");
	case EMGAnimState::Respawn: return FName("Respawn");
	default: return NAME_None;
	}
}

AMGAvatarCharacter* UMGAnimInstance::GetOwningAvatar() const
{
	if (APawn* Pawn = TryGetPawnOwner())
	{
		return Cast<AMGAvatarCharacter>(Pawn);
	}
	return nullptr;
}

UMGCombatComponent* UMGAnimInstance::GetCombatComponent() const
{
	AMGAvatarCharacter* Avatar = GetOwningAvatar();
	return Avatar ? Avatar->CombatComponent : nullptr;
}
