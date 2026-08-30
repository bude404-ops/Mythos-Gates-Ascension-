#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGMichael_AnimData.generated.h"

// Per-deity animation data asset for Michael (MG-DEITY-046)
// SwordShield weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Empyrean — pure light elemental (no skin), silver-white gothic plate, radiant light

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGMichael_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGMichael_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-046"
    static const FName DeityName;      // "Michael"
    static const FName WeaponAnimClass; // "SwordShield"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-046_Michael"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // pure light elemental (no skin)

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // silver-white gothic plate

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName WeaponMaterial;   // deity-specific weapon material

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ClothMaterial;    // faction cloth/silk material

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName VFXMaterial;      // faction energy VFX material

    // Cloth physics configuration
    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    bool bEnableClothPhysics = false;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothWindScale = 0.4f;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothGravityScale = 0.9f;

    // Wing configuration (lighttether)
    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    bool bEnableWings = true;

    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    float WingSpreadScale = 1.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    FName WingType = "LightTether";

    // VFX socket bindings
    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName HandVFXSocket = "vfx_socket_Hands";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName GroundVFXSocket = "vfx_socket_Ground";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName ChestVFXSocket = "vfx_socket_Chest";

    // Radiance meter drives light VFX intensity through armor seams (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float RadianceLevel = 0.0f;

    // Whether the deity is standing on hallowed ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnHallowedGround = false;

    // Light-phase blend for dodge dash radiance burst
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float LightPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> SwordShieldMontage;
};
