#include "MGBeliefComponent.h"

UMGBeliefComponent::UMGBeliefComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
}

void UMGBeliefComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

	// Track time since last combat action
	TimeSinceLastAction += DeltaTime;

	// Slight belief decay if not in combat
	if (TimeSinceLastAction >= DecayDelay && CurrentBelief > 0.0f)
	{
		CurrentBelief = FMath::Max(0.0f, CurrentBelief - (DecayRate * DeltaTime));
	}
}

void UMGBeliefComponent::AddBelief(float Amount, EMGBeliefSource Source)
{
	// Apply source-specific multiplier
	float FinalAmount = Amount;

	switch (Source)
	{
	case EMGBeliefSource::BasicAttack:
		FinalAmount = BeliefPerBasicAttack;
		break;
	case EMGBeliefSource::AbilityUse:
		FinalAmount = BeliefPerAbilityUse;
		break;
	case EMGBeliefSource::Dodge:
		FinalAmount = BeliefPerDodge;
		break;
	case EMGBeliefSource::PassiveProc:
		FinalAmount = BeliefPerPassiveProc;
		break;
	default:
		break;
	}

	CurrentBelief = FMath::Clamp(CurrentBelief + FinalAmount, 0.0f, MaxBelief);
	TimeSinceLastAction = 0.0f; // Reset decay timer
}

void UMGBeliefComponent::AddKillBelief()
{
	CurrentBelief = FMath::Clamp(CurrentBelief + BeliefPerKill, 0.0f, MaxBelief);
	TimeSinceLastAction = 0.0f;
}

void UMGBeliefComponent::AddFaithTriggerBelief()
{
	CurrentBelief = FMath::Clamp(CurrentBelief + BeliefPerFaithTrigger, 0.0f, MaxBelief);
}

void UMGBeliefComponent::ConsumeBelief()
{
	CurrentBelief = 0.0f;
}

bool UMGBeliefComponent::IsBeliefFull() const
{
	return CurrentBelief >= MaxBelief;
}

float UMGBeliefComponent::GetBeliefPercent() const
{
	return MaxBelief > 0.0f ? CurrentBelief / MaxBelief : 0.0f;
}
