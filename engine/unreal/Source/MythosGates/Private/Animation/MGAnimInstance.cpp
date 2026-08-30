#include "MGAnimInstance.h"
#include "Combat/MGAvatarCharacter.h"
#include "Combat/MGCombatComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Animation/AnimMontage.h"

// Per-deity anim data includes (28 deities)
#include "Animation/MGAtenRa_AnimData.h"
#include "Animation/MGSutekh_AnimData.h"
#include "Animation/MGIset_AnimData.h"
#include "Animation/MGAmunet_AnimData.h"
#include "Animation/MGOdin_AnimData.h"
#include "Animation/MGThor_AnimData.h"
#include "Animation/MGSkadi_AnimData.h"
#include "Animation/MGFreyja_AnimData.h"
#include "Animation/MGZeus_AnimData.h"
#include "Animation/MGAthena_AnimData.h"
#include "Animation/MGArtemis_AnimData.h"
#include "Animation/MGAres_AnimData.h"
#include "Animation/MGAmaterasu_AnimData.h"
#include "Animation/MGTsukuyomi_AnimData.h"
#include "Animation/MGSusanoo_AnimData.h"
#include "Animation/MGIzanami_AnimData.h"
#include "Animation/MGDagda_AnimData.h"
#include "Animation/MGBrigid_AnimData.h"
#include "Animation/MGMorrigan_AnimData.h"
#include "Animation/MGLugh_AnimData.h"
#include "Animation/MGMichael_AnimData.h"
#include "Animation/MGGabriel_AnimData.h"
#include "Animation/MGRaphael_AnimData.h"
#include "Animation/MGJophiel_AnimData.h"
#include "Animation/MGLucifer_AnimData.h"
#include "Animation/MGAsmodeus_AnimData.h"
#include "Animation/MGLilith_AnimData.h"
#include "Animation/MGNaamah_AnimData.h"

UMGAnimInstance::UMGAnimInstance()
{
}

void UMGAnimInstance::LoadDeityAnimData(FName DeityId)
{
    // Map deity IDs to their anim data asset classes
    // Each deity has a dedicated UMG<Name>_AnimData data asset
    // The data asset is loaded in the UE5 editor and referenced here

    struct FDeityAnimEntry
    {
        FName Id;
        FName WeaponClass;
        bool bHasWings;
        bool bHasCloth;
        bool bHasChain;
        bool bHasSpirit;
        bool bHasAntiLight;
    };

    static const TMap<FName, FDeityAnimEntry> DeityMap = {
        {FName("MG-DEITY-001"), {FName("StaffCaster"), false, true,  false, false, false}}, // Aten Ra
        {FName("MG-DEITY-002"), {FName("StaffCaster"), false, true,  false, false, false}}, // Sutekh
        {FName("MG-DEITY-003"), {FName("StaffCaster"), false, true,  false, false, false}}, // Iset
        {FName("MG-DEITY-004"), {FName("DualDagger"),  false, true,  false, false, false}}, // Amunet
        {FName("MG-DEITY-010"), {FName("StaffCaster"), true,  true,  false, false, false}}, // Odin
        {FName("MG-DEITY-011"), {FName("GreatWeapon"), false, true,  false, false, false}}, // Thor
        {FName("MG-DEITY-012"), {FName("BowRanged"),   false, true,  false, false, false}}, // Skadi
        {FName("MG-DEITY-013"), {FName("DualDagger"),  true,  true,  false, false, false}}, // Freyja
        {FName("MG-DEITY-019"), {FName("GreatWeapon"), false, true,  false, false, false}}, // Zeus
        {FName("MG-DEITY-020"), {FName("SwordShield"), false, true,  false, false, false}}, // Athena
        {FName("MG-DEITY-021"), {FName("BowRanged"),   false, true,  false, false, false}}, // Artemis
        {FName("MG-DEITY-022"), {FName("SwordShield"), false, true,  false, false, false}}, // Ares
        {FName("MG-DEITY-028"), {FName("BowRanged"),   false, true,  false, true,  false}}, // Amaterasu
        {FName("MG-DEITY-029"), {FName("SpearPolearm"),false, true,  false, true,  false}}, // Tsukuyomi
        {FName("MG-DEITY-030"), {FName("SwordShield"), false, true,  false, true,  false}}, // Susanoo
        {FName("MG-DEITY-031"), {FName("DualDagger"),  false, true,  true,  true,  false}}, // Izanami
        {FName("MG-DEITY-037"), {FName("GreatWeapon"), false, true,  false, false, false}}, // Dagda
        {FName("MG-DEITY-038"), {FName("StaffCaster"), false, true,  false, false, false}}, // Brigid
        {FName("MG-DEITY-039"), {FName("SwordShield"), false, true,  false, false, false}}, // Morrigan
        {FName("MG-DEITY-040"), {FName("BowRanged"),   false, true,  false, false, false}}, // Lugh
        {FName("MG-DEITY-046"), {FName("SwordShield"),true,  false, false, false, false}}, // Michael
        {FName("MG-DEITY-047"), {FName("StaffCaster"),true,  false, false, false, false}}, // Gabriel
        {FName("MG-DEITY-048"), {FName("DualDagger"),  true,  false, false, false, false}}, // Raphael
        {FName("MG-DEITY-049"), {FName("BowRanged"),   true,  false, false, false, false}}, // Jophiel
        {FName("MG-DEITY-055"), {FName("StaffCaster"), false, true,  false, false, true }}, // Lucifer
        {FName("MG-DEITY-056"), {FName("GreatWeapon"), false, true,  false, false, true }}, // Asmodeus
        {FName("MG-DEITY-057"), {FName("DualDagger"),  false, true,  false, false, true }}, // Lilith
        {FName("MG-DEITY-058"), {FName("BowRanged"),   false, true,  false, false, true }}, // Naamah
    };

    const FDeityAnimEntry* Entry = DeityMap.Find(DeityId);
    if (!Entry)
    {
        UE_LOG(LogTemp, Warning, TEXT("MGAnimInstance: Unknown deity ID %s"), *DeityId.ToString());
        return;
    }

    // Set weapon class for montage selection
    if (Entry->WeaponClass == FName("GreatWeapon"))  WeaponClass = EMGWeaponAnimClass::GreatWeapon;
    else if (Entry->WeaponClass == FName("SwordShield")) WeaponClass = EMGWeaponAnimClass::SwordShield;
    else if (Entry->WeaponClass == FName("StaffCaster")) WeaponClass = EMGWeaponAnimClass::StaffCaster;
    else if (Entry->WeaponClass == FName("SpearPolearm")) WeaponClass = EMGWeaponAnimClass::SpearPolearm;
    else if (Entry->WeaponClass == FName("BowRanged")) WeaponClass = EMGWeaponAnimClass::BowRanged;
    else if (Entry->WeaponClass == FName("DualDagger")) WeaponClass = EMGWeaponAnimClass::DualDagger;

    // Apply special flags to anim state
    bHasWings = Entry->bHasWings;
    bHasClothPhysics = Entry->bHasCloth;
    bHasChainPhysics = Entry->bHasChain;
    bHasSpiritTranslucency = Entry->bHasSpirit;
    bHasAntiLightShader = Entry->bHasAntiLight;

    UE_LOG(LogTemp, Log, TEXT("MGAnimInstance: Loaded deity %s — Weapon: %s, Wings: %s, Cloth: %s, Chain: %s, Spirit: %s, AntiLight: %s"),
        *DeityId.ToString(),
        *Entry->WeaponClass.ToString(),
        Entry->bHasWings ? TEXT("Yes") : TEXT("No"),
        Entry->bHasCloth ? TEXT("Yes") : TEXT("No"),
        Entry->bHasChain ? TEXT("Yes") : TEXT("No"),
        Entry->bHasSpirit ? TEXT("Yes") : TEXT("No"),
        Entry->bHasAntiLight ? TEXT("Yes") : TEXT("No"));
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
