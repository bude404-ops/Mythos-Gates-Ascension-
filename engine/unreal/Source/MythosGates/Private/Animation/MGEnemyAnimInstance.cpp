#include "MGEnemyAnimInstance.h"
#include "Combat/MGEnemyCharacter.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Animation/AnimMontage.h"

UMGEnemyAnimInstance::UMGEnemyAnimInstance()
{
}

void UMGEnemyAnimInstance::NativeUpdateAnimation(float DeltaTimeX)
{
	Super::NativeUpdateAnimation(DeltaTimeX);

	AMGEnemyCharacter* Enemy = GetOwningEnemy();
	if (!Enemy)
		return;

	bIsDead = Enemy->IsDead();

	if (UCharacterMovementComponent* MoveComp = Enemy->GetCharacterMovement())
	{
		MovementSpeed = MoveComp->Velocity.Size();
	}

	// State machine
	if (bIsDead)
	{
		if (CurrentState != EMGEnemyAnimState::Death)
		{
			CurrentState = EMGEnemyAnimState::Death;
			PlayDeath();
		}
		return;
	}

	switch (CurrentState)
	{
	case EMGEnemyAnimState::Attack:
	case EMGEnemyAnimState::Telegraph:
	case EMGEnemyAnimState::HitReact:
		// These play to completion, then return to locomotion
		if (!IsAnyMontagePlaying())
		{
			CurrentState = (MovementSpeed > 10.0f) ? EMGEnemyAnimState::Walk : EMGEnemyAnimState::Idle;
		}
		break;
	case EMGEnemyAnimState::Idle:
	case EMGEnemyAnimState::Walk:
		if (MovementSpeed > 10.0f)
			CurrentState = EMGEnemyAnimState::Walk;
		else
			CurrentState = EMGEnemyAnimState::Idle;
		break;
	case EMGEnemyAnimState::Death:
		break;
	}
}

void UMGEnemyAnimInstance::PlayAttackAnim()
{
	if (bIsDead)
		return;

	CurrentState = EMGEnemyAnimState::Attack;
	StopAllMontages(0.05f);
	// TODO: Play attack montage based on BodyType
}

void UMGEnemyAnimInstance::PlayTelegraphAnim()
{
	if (bIsDead)
		return;

	CurrentState = EMGEnemyAnimState::Telegraph;
	StopAllMontages(0.05f);
	// TODO: Play telegraph montage based on BodyType
}

void UMGEnemyAnimInstance::PlayHitReact()
{
	if (bIsDead)
		return;

	CurrentState = EMGEnemyAnimState::HitReact;
	StopAllMontages(0.05f);
	// TODO: Play hit react montage based on BodyType
}

void UMGEnemyAnimInstance::PlayDeath()
{
	CurrentState = EMGEnemyAnimState::Death;
	StopAllMontages(0.0f);
	// TODO: Play death montage based on BodyType
}

AMGEnemyCharacter* UMGEnemyAnimInstance::GetOwningEnemy() const
{
	if (APawn* Pawn = TryGetPawnOwner())
	{
		return Cast<AMGEnemyCharacter>(Pawn);
	}
	return nullptr;
}
