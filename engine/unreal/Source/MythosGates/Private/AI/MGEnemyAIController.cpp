#include "MGEnemyAIController.h"
#include "Combat/MGEnemyCharacter.h"
#include "Combat/MGAvatarCharacter.h"
#include "Combat/MGBeliefComponent.h"
#include "Combat/MGGroundEffectZone.h"
#include "Game/MGGameMode.h"
#include "BehaviorTree/BehaviorTree.h"
#include "BehaviorTree/BlackboardComponent.h"
#include "NavigationSystem.h"
#include "Kismet/GameplayStatics.h"

AMGEnemyAIController::AMGEnemyAIController()
{
}

void AMGEnemyAIController::OnPossess(APawn* InPawn)
{
	Super::OnPossess(InPawn);

	ControlledEnemy = Cast<AMGEnemyCharacter>(InPawn);

	// Find the avatar
	TArray<AActor*> Avatars;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGAvatarCharacter::StaticClass(), Avatars);
	if (Avatars.Num() > 0)
	{
		Avatar = Cast<AMGAvatarCharacter>(Avatars[0]);
	}
}

void AMGEnemyAIController::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	if (!ControlledEnemy || ControlledEnemy->IsDead() || !Avatar || Avatar->IsDead())
		return;

	// Decision loop — re-evaluate at intervals
	DecisionTimer -= DeltaTime;
	if (DecisionTimer <= 0.0f)
	{
		DecisionTimer = DecisionInterval;
		// Re-evaluate target and state
	}

	// Attack timer
	AttackTimer -= DeltaTime;

	// Execute archetype-specific behavior
	switch (ControlledEnemy->Archetype)
	{
	case EMGEnemyArchetype::Swarmer:
		ExecuteSwarmerAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Brute:
		ExecuteBruteAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Hunter:
		ExecuteHunterAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Controller:
		ExecuteControllerAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Disruptor:
		ExecuteDisruptorAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Guardian:
		ExecuteGuardianAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Executioner:
		ExecuteExecutionerAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Elite:
		ExecuteEliteAI(DeltaTime);
		break;
	case EMGEnemyArchetype::Champion:
		ExecuteChampionAI(DeltaTime);
		break;
	case EMGEnemyArchetype::EnemyDeity:
		ExecuteEnemyDeityAI(DeltaTime);
		break;
	}
}

void AMGEnemyAIController::SetArchetype(EMGEnemyArchetype NewArchetype)
{
	if (ControlledEnemy)
	{
		ControlledEnemy->Archetype = NewArchetype;

		// Adjust stats based on archetype
		switch (NewArchetype)
		{
		case EMGEnemyArchetype::Swarmer:
			ControlledEnemy->MaxHP = 30.0f;
			ControlledEnemy->AttackPower = 5.0f;
			ControlledEnemy->MoveSpeed = 400.0f;
			ControlledEnemy->AttackRange = 100.0f;
			ControlledEnemy->AttackCooldown = 1.5f;
			break;
		case EMGEnemyArchetype::Brute:
			ControlledEnemy->MaxHP = 150.0f;
			ControlledEnemy->AttackPower = 15.0f;
			ControlledEnemy->MoveSpeed = 200.0f;
			ControlledEnemy->AttackRange = 150.0f;
			ControlledEnemy->AttackCooldown = 3.0f;
			break;
		case EMGEnemyArchetype::Hunter:
			ControlledEnemy->MaxHP = 50.0f;
			ControlledEnemy->AttackPower = 10.0f;
			ControlledEnemy->MoveSpeed = 250.0f;
			ControlledEnemy->AttackRange = 600.0f;
			ControlledEnemy->AttackCooldown = 2.5f;
			break;
		case EMGEnemyArchetype::Controller:
			ControlledEnemy->MaxHP = 80.0f;
			ControlledEnemy->AttackPower = 8.0f;
			ControlledEnemy->MoveSpeed = 300.0f;
			ControlledEnemy->AttackRange = 400.0f;
			ControlledEnemy->AttackCooldown = 2.0f;
			break;
		case EMGEnemyArchetype::Disruptor:
			ControlledEnemy->MaxHP = 70.0f;
			ControlledEnemy->AttackPower = 7.0f;
			ControlledEnemy->MoveSpeed = 350.0f;
			ControlledEnemy->AttackRange = 300.0f;
			ControlledEnemy->AttackCooldown = 1.8f;
			break;
		case EMGEnemyArchetype::Guardian:
			ControlledEnemy->MaxHP = 200.0f;
			ControlledEnemy->AttackPower = 12.0f;
			ControlledEnemy->MoveSpeed = 150.0f;
			ControlledEnemy->AttackRange = 120.0f;
			ControlledEnemy->AttackCooldown = 2.5f;
			break;
		case EMGEnemyArchetype::Executioner:
			ControlledEnemy->MaxHP = 100.0f;
			ControlledEnemy->AttackPower = 20.0f;
			ControlledEnemy->MoveSpeed = 300.0f;
			ControlledEnemy->AttackRange = 150.0f;
			ControlledEnemy->AttackCooldown = 3.5f;
			break;
		case EMGEnemyArchetype::Elite:
			ControlledEnemy->MaxHP = 120.0f;
			ControlledEnemy->AttackPower = 14.0f;
			ControlledEnemy->MoveSpeed = 280.0f;
			ControlledEnemy->AttackRange = 200.0f;
			ControlledEnemy->AttackCooldown = 2.0f;
			break;
		case EMGEnemyArchetype::Champion:
			ControlledEnemy->MaxHP = 300.0f;
			ControlledEnemy->AttackPower = 18.0f;
			ControlledEnemy->MoveSpeed = 250.0f;
			ControlledEnemy->AttackRange = 180.0f;
			ControlledEnemy->AttackCooldown = 2.2f;
			break;
		case EMGEnemyArchetype::EnemyDeity:
			ControlledEnemy->MaxHP = 500.0f;
			ControlledEnemy->AttackPower = 25.0f;
			ControlledEnemy->MoveSpeed = 300.0f;
			ControlledEnemy->AttackRange = 250.0f;
			ControlledEnemy->AttackCooldown = 1.5f;
			break;
		}

		ControlledEnemy->CurrentHP = ControlledEnemy->MaxHP;
	}
}

// === SWARMER ===
// Purpose: Create positional pressure and execution chains
// Decision loop: seek isolated deity -> prefer flank lane -> force reaction spend -> chain execution bait
void AMGEnemyAIController::ExecuteSwarmerAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		// Move to flank the avatar — approach from side/rear
		FVector FlankDirection = (Avatar->GetActorLocation() - ControlledEnemy->GetActorLocation()).GetSafeNormal();
		// Offset direction for flanking
		FlankDirection = FlankDirection.RotateAngleAxis(45.0f, FVector::UpVector);
		MoveTowardAvatar(ControlledEnemy->MoveSpeed);
	}
	else
	{
		TryAttack();
	}
}

// === BRUTE ===
// Purpose: Force stance discipline and terrain planning
// Decision loop: claim center lane -> telegraph crush -> attack objective cover -> guard-break deity
void AMGEnemyAIController::ExecuteBruteAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		// Brutes charge through hazards (they're tanky enough)
		MoveTowardAvatar(ControlledEnemy->MoveSpeed);
	}
	else
	{
		TryAttack();
	}
}

// === HUNTER ===
// Purpose: Threaten from range and punish exposed paths
// Decision loop: hold range -> seek line of sight -> mark exposed deity -> withdraw from melee
void AMGEnemyAIController::ExecuteHunterAI(float DeltaTime)
{
	float Distance = GetDistanceToAvatar();

	if (Distance < ControlledEnemy->AttackRange * 0.5f)
	{
		// Too close — kite away
		MoveAwayFromAvatar(ControlledEnemy->MoveSpeed);
	}
	else if (Distance > ControlledEnemy->AttackRange)
	{
		// Too far — move closer
		MoveTowardAvatar(ControlledEnemy->MoveSpeed * 0.7f);
	}
	else
	{
		// In range — attack
		TryAttack();
	}
}

// === CONTROLLER ===
// Purpose: Restrict movement and disrupt clean objective routes
// Decision loop: place zone -> root/debuff deity -> deny terrain -> maintain zone pressure
void AMGEnemyAIController::ExecuteControllerAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		// Controllers move to strategic positions near buff zones to deny them
		AMGGroundEffectZone* BuffZone = FindNearestBuffZone();
		if (BuffZone)
		{
			// Move toward buff zone to contest it
			UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
			if (NavSys)
			{
				NavSys->SimpleMoveToLocation(this, BuffZone->GetActorLocation());
			}
		}
		else
		{
			MoveTowardAvatar(ControlledEnemy->MoveSpeed * 0.8f);
		}
	}
	else
	{
		TryAttack();
	}
}

// === DISRUPTOR ===
// Purpose: Attack Momentum, Divinity, cooldowns, and reactions
// Decision loop: time ability disruption -> drain energy -> force waste -> exploit openings
void AMGEnemyAIController::ExecuteDisruptorAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		MoveTowardAvatar(ControlledEnemy->MoveSpeed);
	}
	else
	{
		// Disruptors prioritize attacking when avatar has high energy
		TryAttack();
	}
}

// === GUARDIAN ===
// Purpose: Protect bosses, rituals, exits, and high-value threats
// Decision loop: hold position -> guard objective -> intercept approaching deity -> deny advance
void AMGEnemyAIController::ExecuteGuardianAI(float DeltaTime)
{
	// Guardians don't chase — they hold position and intercept
	float Distance = GetDistanceToAvatar();

	if (Distance < ControlledEnemy->AttackRange * 1.5f)
	{
		// Avatar is close enough to threaten — engage
		TryAttack();
	}
	else
	{
		// Hold position — don't chase
		CurrentState = EAIState::Guarding;
	}
}

// === EXECUTIONER ===
// Purpose: Make low-health deity states dangerous without cheap instant kills
// Decision loop: assess deity HP -> position for execution -> telegraph -> strike if threshold
void AMGEnemyAIController::ExecuteExecutionerAI(float DeltaTime)
{
	if (!Avatar)
		return;

	float AvatarHPPct = Avatar->CurrentHP / Avatar->MaxHP;

	if (AvatarHPPct < 0.3f)
	{
		// Avatar is low — executioner gets aggressive
		if (!IsInAttackRange())
		{
			MoveTowardAvatar(ControlledEnemy->MoveSpeed * 1.2f); // Move faster when avatar is low
		}
		else
		{
			TryAttack(); // Attack more frequently when avatar is low
		}
	}
	else
	{
		// Avatar is healthy — approach cautiously
		if (!IsInAttackRange())
		{
			MoveTowardAvatar(ControlledEnemy->MoveSpeed * 0.8f);
		}
		else
		{
			TryAttack();
		}
	}
}

// === ELITE ===
// Purpose: Single mechanic-focused enemy that changes how the room is solved
void AMGEnemyAIController::ExecuteEliteAI(float DeltaTime)
{
	// Elites have unique mechanics — for now, use Hunter-like behavior
	ExecuteHunterAI(DeltaTime);
}

// === CHAMPION ===
// Purpose: Mini-boss duel embedded inside a larger battlefield
void AMGEnemyAIController::ExecuteChampionAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		MoveTowardAvatar(ControlledEnemy->MoveSpeed);
	}
	else
	{
		TryAttack();
	}
}

// === ENEMY DEITY ===
// Purpose: Major boss mirror — another mythic being with its own meters and abilities
void AMGEnemyAIController::ExecuteEnemyDeityAI(float DeltaTime)
{
	if (!IsInAttackRange())
	{
		MoveTowardAvatar(ControlledEnemy->MoveSpeed);
	}
	else
	{
		// Enemy deities attack faster and have more complex patterns
		TryAttack();
	}
}

// === Shared Utilities ===

void AMGEnemyAIController::MoveTowardAvatar(float Speed)
{
	if (!Avatar || !ControlledEnemy)
		return;

	FVector Direction = (Avatar->GetActorLocation() - ControlledEnemy->GetActorLocation()).GetSafeNormal();

	// Avoid hazards
	if (IsInHazard())
	{
		// Steer away from hazard
		FVector SafePos = FindSafePositionNearAvatar(ControlledEnemy->AttackRange);
		UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
		if (NavSys)
		{
			NavSys->SimpleMoveToLocation(this, SafePos);
		}
	}
	else
	{
		UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
		if (NavSys)
		{
			NavSys->SimpleMoveToLocation(this, Avatar->GetActorLocation());
		}
	}
}

void AMGEnemyAIController::MoveAwayFromAvatar(float Speed)
{
	if (!Avatar || !ControlledEnemy)
		return;

	FVector Direction = (ControlledEnemy->GetActorLocation() - Avatar->GetActorLocation()).GetSafeNormal();
	FVector AwayPos = ControlledEnemy->GetActorLocation() + Direction * 500.0f;

	UNavigationSystemV1* NavSys = UNavigationSystemV1::GetCurrent(GetWorld());
	if (NavSys)
	{
		NavSys->SimpleMoveToLocation(this, AwayPos);
	}
}

float AMGEnemyAIController::GetDistanceToAvatar() const
{
	if (!Avatar || !ControlledEnemy)
		return FLT_MAX;

	return FVector::Dist(Avatar->GetActorLocation(), ControlledEnemy->GetActorLocation());
}

bool AMGEnemyAIController::IsInAttackRange() const
{
	return GetDistanceToAvatar() <= ControlledEnemy->AttackRange;
}

bool AMGEnemyAIController::IsInGroundZone(EMGZoneType ZoneType) const
{
	if (!ControlledEnemy)
		return false;

	TArray<AActor*> Zones;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGGroundEffectZone::StaticClass(), Zones);

	for (AActor* ZoneActor : Zones)
	{
		AMGGroundEffectZone* Zone = Cast<AMGGroundEffectZone>(ZoneActor);
		if (Zone && Zone->ZoneType == ZoneType)
		{
			float Dist = FVector::Dist(ControlledEnemy->GetActorLocation(), Zone->GetActorLocation());
			if (Dist <= Zone->Radius)
				return true;
		}
	}

	return false;
}

AMGGroundEffectZone* AMGEnemyAIController::FindNearestZone(EMGZoneType ZoneType) const
{
	if (!ControlledEnemy)
		return nullptr;

	TArray<AActor*> Zones;
	UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGGroundEffectZone::StaticClass(), Zones);

	AMGGroundEffectZone* Nearest = nullptr;
	float NearestDist = FLT_MAX;

	for (AActor* ZoneActor : Zones)
	{
		AMGGroundEffectZone* Zone = Cast<AMGGroundEffectZone>(ZoneActor);
		if (Zone && Zone->ZoneType == ZoneType)
		{
			float Dist = FVector::Dist(ControlledEnemy->GetActorLocation(), Zone->GetActorLocation());
			if (Dist < NearestDist)
			{
				NearestDist = Dist;
				Nearest = Zone;
			}
		}
	}

	return Nearest;
}

AMGGroundEffectZone* AMGEnemyAIController::FindNearestBuffZone() const
{
	return FindNearestZone(EMGZoneType::Buff);
}

bool AMGEnemyAIController::IsInHazard() const
{
	return IsInGroundZone(EMGZoneType::Hazard);
}

FVector AMGEnemyAIController::FindSafePositionNearAvatar(float DesiredDistance) const
{
	if (!Avatar || !ControlledEnemy)
		return FVector::ZeroVector;

	// Try several positions around the avatar at the desired distance
	for (int32 i = 0; i < 8; i++)
	{
		float Angle = i * 45.0f;
		FVector Offset = FVector(FMath::Cos(FMath::DegreesToRadians(Angle)), FMath::Sin(FMath::DegreesToRadians(Angle)), 0.0f) * DesiredDistance;
		FVector Candidate = Avatar->GetActorLocation() + Offset;

		// Check if this position is not in a hazard zone
		bool bSafe = true;
		TArray<AActor*> Zones;
		UGameplayStatics::GetAllActorsOfClass(GetWorld(), AMGGroundEffectZone::StaticClass(), Zones);

		for (AActor* ZoneActor : Zones)
		{
			AMGGroundEffectZone* Zone = Cast<AMGGroundEffectZone>(ZoneActor);
			if (Zone && Zone->ZoneType == EMGZoneType::Hazard)
			{
				float Dist = FVector::Dist(Candidate, Zone->GetActorLocation());
				if (Dist <= Zone->Radius)
				{
					bSafe = false;
					break;
				}
			}
		}

		if (bSafe)
			return Candidate;
	}

	// Fallback — just return avatar position
	return Avatar->GetActorLocation();
}

bool AMGEnemyAIController::IsAvatarBeliefHigh() const
{
	if (!Avatar || !Avatar->BeliefComponent)
		return false;

	return Avatar->BeliefComponent->GetBeliefPercent() > 0.8f;
}

void AMGEnemyAIController::TryAttack()
{
	if (AttackTimer > 0.0f)
		return;

	if (!IsInAttackRange() || !Avatar)
		return;

	AttackTimer = ControlledEnemy->AttackCooldown;

	// Attack the avatar with dodge/parry resolution
	Avatar->TakeDamageWithResolution(
		ControlledEnemy->AttackPower,
		ControlledEnemy->Accuracy,
		ControlledEnemy->AttackPower
	);

	// Telegraph: enemies show a visible wind-up before attacking
	// TODO: Play attack telegraph animation
}
