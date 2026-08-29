#include "MGPlayerController.h"
#include "Engine/World.h"
#include "GameFramework/Character.h"
#include "Components/DecalComponent.h"

AMGPlayerController::AMGPlayerController()
{
	bShowMouseCursor = true;
	bEnableClickEvents = true;
	bEnableTouchEvents = true;
}

void AMGPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();

	// Touch input for tap-to-move
	InputComponent->BindTouch(IE_Pressed, this, &AMGPlayerController::OnTapMove);

	// Ability buttons (UI-driven, these are programmatic bindings)
	InputComponent->BindAction("Ability1", IE_Pressed, this, &AMGPlayerController::OnAbility1Pressed);
	InputComponent->BindAction("Ability2", IE_Pressed, this, &AMGPlayerController::OnAbility2Pressed);
	InputComponent->BindAction("Signature", IE_Pressed, this, &AMGPlayerController::OnSignaturePressed);
	InputComponent->BindAction("Ultimate", IE_Pressed, this, &AMGPlayerController::OnUltimatePressed);
	InputComponent->BindAction("Dodge", IE_Pressed, this, &AMGPlayerController::OnDodgePressed);
}

void AMGPlayerController::OnTapMove(const FVector2D& ScreenPosition)
{
	FVector WorldLocation = ScreenToWorld(ScreenPosition);
	if (APawn* Pawn = GetPawn())
	{
		// Use AI navigation for tap-to-move
		FVector Direction = (WorldLocation - Pawn->GetActorLocation()).GetSafeNormal();
		// TODO: Use UNavigationSystemV1::SimpleMoveToLocation for pathfinding
	}
}

FVector AMGPlayerController::ScreenToWorld(const FVector2D& ScreenPos)
{
	FVector WorldLocation, WorldDirection;
	DeprojectScreenPositionToWorld(ScreenPos.X, ScreenPos.Y, WorldLocation, WorldDirection);

	// Trace to ground plane
	FCollisionQueryParams QueryParams;
	QueryParams.AddIgnoredActor(GetPawn());

	FHitResult Hit;
	FVector TraceEnd = WorldLocation + WorldDirection * 10000.0f;
	if (GetWorld()->LineTraceSingleByChannel(Hit, WorldLocation, TraceEnd, ECC_Visibility, QueryParams))
	{
		return Hit.Location;
	}
	return WorldLocation;
}

void AMGPlayerController::OnAbility1Pressed()
{
	// TODO: Trigger deity ability 1
}

void AMGPlayerController::OnAbility2Pressed()
{
	// TODO: Trigger deity ability 2
}

void AMGPlayerController::OnSignaturePressed()
{
	// TODO: Trigger deity signature ability
}

void AMGPlayerController::OnUltimatePressed()
{
	// TODO: Trigger deity ultimate (requires 100% Belief bar)
}

void AMGPlayerController::OnDodgePressed()
{
	// Spatial dash — quick reposition, NOT timing-based, NOT i-frames
	if (DodgeCooldownTimer > 0.0f) return;

	DodgeCooldownTimer = DodgeCooldown;

	if (APawn* Pawn = GetPawn())
	{
		// Dash in movement direction or forward
		FVector DashDirection = Pawn->GetActorForwardVector();
		// TODO: Apply dash movement
	}
}

void AMGPlayerController::CheckAutoAttack()
{
	// Auto basic attack — triggers when enemy is within weapon range
	// No player input needed
	// TODO: Check for enemies in weapon range and trigger basic attack
}
