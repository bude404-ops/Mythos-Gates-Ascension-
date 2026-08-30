#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimInstance.h"
#include "MGAnimInstance.generated.h"

// Main animation instance for all deity avatars
// Driven by MGCombatComponent state + CharacterMovementComponent
// Uses weapon class to select the correct animation montage
// 3 state machines: Locomotion, Combat, Reaction

class UMGCombatComponent;
class AMGAvatarCharacter;

UENUM(BlueprintType)
enum class EMGAnimState : uint8
{
	Spawn UMETA(DisplayName = "Spawn"),
	Idle UMETA(DisplayName = "Idle"),
	Walk UMETA(DisplayName = "Walk"),
	BasicAttack1 UMETA(DisplayName = "Basic Attack 1"),
	BasicAttack2 UMETA(DisplayName = "Basic Attack 2"),
	BasicAttack3 UMETA(DisplayName = "Basic Attack 3"),
	Ability1 UMETA(DisplayName = "Ability 1"),
	Ability2 UMETA(DisplayName = "Ability 2"),
	Signature UMETA(DisplayName = "Signature"),
	Ultimate UMETA(DisplayName = "Ultimate"),
	DodgeEvade UMETA(DisplayName = "Dodge Evade"),
	ParryBlock UMETA(DisplayName = "Parry Block"),
	HitReact UMETA(DisplayName = "Hit React"),
	DodgeDash UMETA(DisplayName = "Dodge Dash"),
	Death UMETA(DisplayName = "Death"),
	Respawn UMETA(DisplayName = "Respawn")
};

UENUM(BlueprintType)
enum class EMGWeaponAnimClass : uint8
{
	GreatWeapon UMETA(DisplayName = "Great Weapon"),
	SwordShield UMETA(DisplayName = "Sword & Shield"),
	StaffCaster UMETA(DisplayName = "Staff / Caster"),
	SpearPolearm UMETA(DisplayName = "Spear / Polearm"),
	BowRanged UMETA(DisplayName = "Bow / Ranged"),
	DualDagger UMETA(DisplayName = "Dual Wield / Dagger")
};

UCLASS()
class MYTHOSGATES_API UMGAnimInstance : public UAnimInstance
{
	GENERATED_BODY()

public:
	UMGAnimInstance();

	// Called every frame to update animation state
	virtual void NativeUpdateAnimation(float DeltaTimeX) override;

	// Get current animation state
	UFUNCTION(BlueprintPure, Category = "Animation")
	EMGAnimState GetAnimState() const { return CurrentState; }

	// Get current weapon animation class
	UFUNCTION(BlueprintPure, Category = "Animation")
	EMGWeaponAnimClass GetWeaponAnimClass() const { return WeaponClass; }

	// Set weapon animation class (called when deity is selected)
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void SetWeaponAnimClass(EMGWeaponAnimClass NewClass);

	// Load per-deity animation data (weapon class, wings, cloth, special flags)
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void LoadDeityAnimData(FName DeityId);

	// Trigger a combat animation
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayCombatAnim(EMGAnimState CombatState);

	// Trigger reaction animation (auto-resolved dodge/parry/hit)
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayReactionAnim(EMGAnimState ReactionState);

	// Trigger dodge dash
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayDodgeDash();

	// Trigger death
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayDeath();

	// Trigger spawn
	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlaySpawn();

protected:
	// Current animation state
	UPROPERTY(BlueprintReadOnly, Category = "State")
	EMGAnimState CurrentState = EMGAnimState::Idle;

	// Previous animation state (for blend logic)
	UPROPERTY(BlueprintReadOnly, Category = "State")
	EMGAnimState PreviousState = EMGAnimState::Idle;

	// Weapon animation class (determines which montage to play)
	UPROPERTY(BlueprintReadOnly, Category = "Weapon")
	EMGWeaponAnimClass WeaponClass = EMGWeaponAnimClass::SwordShield;

	// Montage references per weapon class
	UPROPERTY(EditDefaultsOnly, Category = "Montages")
	TMap<EMGWeaponAnimClass, UAnimMontage*> WeaponMontages;

	// Movement speed (for blend space)
	UPROPERTY(BlueprintReadOnly, Category = "Movement")
	float MovementSpeed = 0.0f;

	// Movement direction (for blend space, -180 to 180)
	UPROPERTY(BlueprintReadOnly, Category = "Movement")
	float MovementDirection = 0.0f;

	// Is the avatar dead?
	UPROPERTY(BlueprintReadOnly, Category = "State")
	bool bIsDead = false;

	// Is the avatar in combat (enemy in range)?
	UPROPERTY(BlueprintReadOnly, Category = "State")
	bool bInCombat = false;

	// Combo step (0 = none, 1-3 = combo chain)
	UPROPERTY(BlueprintReadOnly, Category = "Combat")
	int32 ComboStep = 0;

	// Special per-deity animation flags
	UPROPERTY(BlueprintReadOnly, Category = "Deity")
	bool bHasWings = false;

	UPROPERTY(BlueprintReadOnly, Category = "Deity")
	bool bHasClothPhysics = true;

	UPROPERTY(BlueprintReadOnly, Category = "Deity")
	bool bHasChainPhysics = false;

	UPROPERTY(BlueprintReadOnly, Category = "Deity")
	bool bHasSpiritTranslucency = false;

	UPROPERTY(BlueprintReadOnly, Category = "Deity")
	bool bHasAntiLightShader = false;

private:
	// Get the owning avatar
	AMGAvatarCharacter* GetOwningAvatar() const;

	// Get combat component
	UMGCombatComponent* GetCombatComponent() const;

	// Play the appropriate montage section for the current state
	void PlayMontageSection(EMGAnimState State);

	// Get montage section name for a state
	FName GetSectionName(EMGAnimState State) const;

	// State transition logic
	void UpdateLocomotionState();
	void UpdateCombatState();
	void CheckReactionState();

	// Animation timer for combo timeout
	float ComboTimeoutTimer = 0.0f;
	float ComboTimeoutWindow = 1.5f;

	// Reaction priority system
	bool bReactionPending = false;
	EMGAnimState PendingReaction = EMGAnimState::Idle;
};
