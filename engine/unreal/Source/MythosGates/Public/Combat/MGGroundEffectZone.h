#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MGGroundEffectZone.generated.h"

// Ground effect zones on the 2.5D combat plane
// Types: Damage, Buff, Debuff, Hazard
// Unique per battlefield based on faction terrain

UENUM(BlueprintType)
enum class EMGZoneType : uint8
{
	Damage UMETA(DisplayName = "Damage Zone"),
	Buff UMETA(DisplayName = "Buff Zone"),
	Debuff UMETA(DisplayName = "Debuff Zone"),
	Hazard UMETA(DisplayName = "Hazard Zone")
};

UCLASS()
class MYTHOSGATES_API AMGGroundEffectZone : public AActor
{
	GENERATED_BODY()

public:
	AMGGroundEffectZone();

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	EMGZoneType ZoneType = EMGZoneType::Damage;

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	float Radius = 300.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	float Duration = 5.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	float DamagePerSecond = 10.0f;

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	float BuffMultiplier = 1.5f;

	UPROPERTY(BlueprintReadWrite, Category = "Zone")
	FName Faction;

protected:
	virtual void Tick(float DeltaTime) override;
	virtual void BeginPlay() override;

private:
	float CurrentDuration;
};
