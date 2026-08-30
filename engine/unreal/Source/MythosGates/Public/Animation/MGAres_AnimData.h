#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGAres_AnimData.generated.h"

// Per-deity animation data asset for Ares (MG-DEITY-022)
// SwordShield weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Olympian — living marble + bronze-gold lightning veins, warm bronze, laurel green

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGAres_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGAres_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-022"
    static const FName DeityName;      // "Ares"
    static const FName WeaponAnimClass; // "SwordShield"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-022_Ares"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // living marble + bronze-gold lightning veins

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // warm bronze

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

    // Divine fury meter drives lightning VFX intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float DivineFuryLevel = 0.0f;

    // Whether the deity is standing on Olympian marble ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnMarbleGround = false;

    // Thunder-phase blend for dodge dash bolt effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float ThunderPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> SwordShieldMontage;
};
