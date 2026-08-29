#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "MGPlayerController.generated.h"

// Tap-to-move player controller
// Player taps on the battlefield -> avatar walks to that location
// No joystick. Auto basic attacks when enemy in weapon range.
// Dodge button = spatial dash (quick reposition, NOT timing-based)

UCLASS()
class MYTHOSGATES_API AMGPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	AMGPlayerController();

protected:
	virtual void SetupInputComponent() override;

	// Tap-to-move: player taps on screen, avatar moves to that location
	void OnTapMove(const FVector2D& ScreenPosition);

	// Ability button taps
	void OnAbility1Pressed();
	void OnAbility2Pressed();
	void OnSignaturePressed();
	void OnUltimatePressed();

	// Dodge button — spatial dash reposition
	void OnDodgePressed();

	// Auto basic attack — triggers when enemy in weapon range (no input needed)
	void CheckAutoAttack();

private:
	// Convert screen tap to world position for tap-to-move
	FVector ScreenToWorld(const FVector2D& ScreenPos);

	// Dodge dash cooldown
	float DodgeCooldown = 4.0f;
	float DodgeCooldownTimer = 0.0f;

	// Auto attack check interval
	float AutoAttackCheckInterval = 0.2f;
	float AutoAttackCheckTimer = 0.0f;
};
