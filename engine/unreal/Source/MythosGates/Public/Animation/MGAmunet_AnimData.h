#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGAmunet_AnimData.generated.h"

// Per-deity animation data asset for Amunet (MG-DEITY-004)
// DualDagger weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Aten Ra — bronze-brown skin + amber subsurface, obsidian-blue enamel, black-gold scale

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGAmunet_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGAmunet_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-004"
    static const FName DeityName;      // "Amunet"
    static const FName WeaponAnimClass; // "DualDagger"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-004_Amunet"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // bronze-brown skin + amber subsurface

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // obsidian-blue enamel

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

    // Solar Charge meter drives chest VFX intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float SolarChargeLevel = 0.0f;

    // Whether the deity is standing on Aten-lit judgment ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnAtenLitGround = false;

    // Horizon-phase blend for dodge dash shadow effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float HorizonPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> DualDaggerMontage;
};
