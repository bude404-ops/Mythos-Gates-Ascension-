#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGFreyja_AnimData.generated.h"

// Per-deity animation data asset for Freyja (MG-DEITY-013)
// DualDagger weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Asgardian — warm Nordic flesh + pale-blue energy veins, divine silver-iron, storm steel

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGFreyja_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGFreyja_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-013"
    static const FName DeityName;      // "Freyja"
    static const FName WeaponAnimClass; // "DualDagger"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-013_Freyja"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // warm Nordic flesh + pale-blue energy veins

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // divine silver-iron

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

    // Wing configuration (feathered)
    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    bool bEnableWings = true;

    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    float WingSpreadScale = 1.0f;

    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    FName WingType = "Feathered";

    // VFX socket bindings
    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName HandVFXSocket = "vfx_socket_Hands";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName GroundVFXSocket = "vfx_socket_Ground";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName ChestVFXSocket = "vfx_socket_Chest";

    // Rune charge meter drives weapon VFX intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float RuneChargeLevel = 0.0f;

    // Whether the deity is standing on frozen/Runic ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnFrostGround = false;

    // Storm-phase blend for dodge dash lightning effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float StormPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> DualDaggerMontage;
};
