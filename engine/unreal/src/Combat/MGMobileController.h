// Mythos Gates: Ascension — Mobile Controller (2.5D Tap-to-Move)
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "MGMobileController.generated.h"

UCLASS(BlueprintType, Blueprintable)
class AMGMobileController : public APlayerController
{
    GENERATED_BODY()

public:
    AMGMobileController();

    // Tap-to-move on 2.5D plane
    UFUNCTION(BlueprintCallable, Category = "Mobile")
    void HandleTapMove(const FVector2D& TouchLocation);

    // Auto-attack trigger (weapon range based)
    UFUNCTION(BlueprintCallable, Category = "Mobile")
    void HandleAutoAttack();

    // Ability activation (thumb-zone buttons)
    UFUNCTION(BlueprintCallable, Category = "Mobile")
    void HandleAbilityInput(int32 AbilityIndex);

    // Ultimate activation (Belief charged)
    UFUNCTION(BlueprintCallable, Category = "Mobile")
    void HandleUltimateInput();

protected:
    virtual void SetupInputComponent() override;
    virtual void Tick(float DeltaTime) override;

private:
    // 2.5D plane constraint
    FVector2D CombatPlaneMin;
    FVector2D CombatPlaneMax;
};
