#include "MGEnemyCharacter.h"
#include "Game/MGGameMode.h"
#include "Kismet/GameplayStatics.h"

AMGEnemyCharacter::AMGEnemyCharacter()
{
	bUseControllerRotationYaw = false;
}

void AMGEnemyCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (IsDead())
		return;

	// Attack timer
	AttackTimer -= DeltaTime;
}

void AMGEnemyCharacter::TakeDamage(float Damage)
{
	if (IsDead())
		return;

	CurrentHP -= Damage;

	if (CurrentHP <= 0.0f)
	{
		CurrentHP = 0.0f;
		OnDeath();
	}
}

void AMGEnemyCharacter::OnDeath()
{
	// Fire death event
	OnEnemyDied.Broadcast(this);

	// Remove from game mode's active enemy list
	if (AMGGameMode* GM = Cast<AMGGameMode>(GetWorld()->GetAuthGameMode()))
	{
		GM->RemoveEnemy(this);
	}

	// Destroy the actor (or play death animation then destroy)
	// TODO: Play death VFX based on faction
	SetLifeSpan(1.0f); // Destroy after 1 second
}
