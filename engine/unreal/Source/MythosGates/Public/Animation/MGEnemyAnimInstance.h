#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimInstance.h"
#include "MGEnemyAnimInstance.generated.h"

// Enemy animation instance — simpler than avatar
// 4 body types: Humanoid, Brute, Quadruped, Flying
// Humanoid enemies share the master skeleton

class AMGEnemyCharacter;

UENUM(BlueprintType)
enum class EMGEnemyAnimState : uint8
{
	Idle UMETA(DisplayName = "Idle"),
	Walk UMETA(DisplayName = "Walk"),
	Attack UMETA(DisplayName = "Attack"),
	Telegraph UMETA(DisplayName = "Telegraph"),
	HitReact UMETA(DisplayName = "Hit React"),
	Death UMETA(DisplayName = "Death")
};

UENUM(BlueprintType)
enum class EMGEnemyBodyType : uint8
{
	Humanoid UMETA(DisplayName = "Humanoid"),
	Brute UMETA(DisplayName = "Brute"),
	Quadruped UMETA(DisplayName = "Quadruped"),
	Flying UMETA(DisplayName = "Flying")
};

UCLASS()
class MYTHOSGATES_API UMGEnemyAnimInstance : public UAnimInstance
{
	GENERATED_BODY()

public:
	UMGEnemyAnimInstance();

	virtual void NativeUpdateAnimation(float DeltaTimeX) override;

	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayAttackAnim();

	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayTelegraphAnim();

	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayHitReact();

	UFUNCTION(BlueprintCallable, Category = "Animation")
	void PlayDeath();

	UFUNCTION(BlueprintPure, Category = "Animation")
	EMGEnemyAnimState GetEnemyAnimState() const { return CurrentState; }

protected:
	UPROPERTY(BlueprintReadOnly, Category = "State")
	EMGEnemyAnimState CurrentState = EMGEnemyAnimState::Idle;

	UPROPERTY(BlueprintReadOnly, Category = "Body")
	EMGEnemyBodyType BodyType = EMGEnemyBodyType::Humanoid;

	UPROPERTY(BlueprintReadOnly, Category = "Movement")
	float MovementSpeed = 0.0f;

	UPROPERTY(BlueprintReadOnly, Category = "State")
	bool bIsDead = false;

private:
	AMGEnemyCharacter* GetOwningEnemy() const;
};
