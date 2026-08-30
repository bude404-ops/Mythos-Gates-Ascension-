#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGBrigid_AnimData.generated.h"

// Per-deity animation data asset for Brigid (MG-DEITY-038)
// StaffCaster weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Tuatha — druidic organic armor, wood/bone/bark, Celtic bronze

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGBrigid_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGBrigid_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-038"
    static const FName DeityName;      // "Brigid"
    static const FName WeaponAnimClass; // "StaffCaster"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-038_Brigid"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // druidic organic armor

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // wood/bone/bark

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

    // Nature charge meter drives organic VFX intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float NatureChargeLevel = 0.0f;

    // Whether the deity is standing on druidic sacred ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnSacredGround = false;

    // Wild-phase blend for dodge dash root effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float WildPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> StaffCasterMontage;
};
