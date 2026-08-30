#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGIzanami_AnimData.generated.h"

// Per-deity animation data asset for Izanami (MG-DEITY-031)
// DualDagger weapon class - drives montage selection, VFX sockets, cloth physics
// Loaded by MGAnimInstance at deity selection
// Faction: Kami — translucent spirit skin, minimal traditional Japanese armor, spiritual light

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGIzanami_AnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGIzanami_AnimData();

    // Deity identity
    static const FName DeityId;        // "MG-DEITY-031"
    static const FName DeityName;      // "Izanami"
    static const FName WeaponAnimClass; // "DualDagger"

    // Skeletal mesh asset path
    static const FName MeshPath;       // "/Game/Meshes/Deities/MG-DEITY-031_Izanami"

    // Material slot paths (5 slots)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;     // translucent spirit skin

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;    // minimal traditional Japanese armor

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

    // Spirit phase meter drives translucency intensity (0.0 - 1.0)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float SpiritPhaseLevel = 0.0f;

    // Whether the deity is standing on spirit-touched ground
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnSpiritGround = false;

    // Kami-phase blend for dodge dash mist effect
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float KamiPhaseBlend = 0.0f;

    // Montage references (set in editor from data asset)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> DualDaggerMontage;
};
