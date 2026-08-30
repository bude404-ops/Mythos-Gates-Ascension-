#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGAsmodeus_AnimData.generated.h"

// Per-deity animation data asset for Asmodeus (MG-DEITY-056)
// GreatWeapon weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Infernal Dominion — ash/dark skin, dark iron, shadow-silk, anti-radiance

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGAsmodeus_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGAsmodeus_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-056"
    static const FName DeityName;      // "Asmodeus"
    static const FName WeaponAnimClass; // "GreatWeapon"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-056_Asmodeus"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // ash/dark skin

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // dark iron

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName WeaponMaterial;   // deity-specific weapon material

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ClothMaterial;    // faction cloth/silk material

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName VFXMaterial;      // faction energy VFX material

    // Cloth physics configuration
    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    bool bEnableClothPhysics = true;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothWindScale = 0.4f;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothGravityScale = 0.9f;

    // VFX socket bindings
    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName HandVFXSocket = "vfx_socket_Hands";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName GroundVFXSocket = "vfx_socket_Ground";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName ChestVFXSocket = "vfx_socket_Chest";

    // Corruption meter drives anti-radiance VFX intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float CorruptionLevel = 0.0f;

    // Whether the deity is standing on shadow-touched ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnShadowGround = false;

    // Void-phase blend for dodge dash shadow effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float VoidPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> GreatWeaponMontage;
};
