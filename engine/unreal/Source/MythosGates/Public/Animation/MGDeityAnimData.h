#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGDeityAnimData.generated.h"

// Unified per-deity animation data assets for all 14 approved deities
// Phase 2.5 — Animation & Rigging
// Each deity gets its own data asset instance in the UE5 editor
// Weapon class drives montage selection, individuality comes from VFX and weapon mesh

UCLASS(BlueprintType)
class MYTHOSGATES_API UMGDeityAnimData : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UMGDeityAnimData();

    // Deity identity
    UPROPERTY(EditDefaultsOnly, Category = "Identity")
    FName DeityId;

    UPROPERTY(EditDefaultsOnly, Category = "Identity")
    FName DeityName;

    UPROPERTY(EditDefaultsOnly, Category = "Identity")
    FName Faction;

    UPROPERTY(EditDefaultsOnly, Category = "Identity")
    FName Role;

    // Weapon animation class (determines montage set)
    UPROPERTY(EditDefaultsOnly, Category = "Animation")
    FName WeaponAnimClassId;

    // Skeletal mesh path
    UPROPERTY(EditDefaultsOnly, Category = "Mesh")
    FName MeshPath;

    // Material slot paths (5 per deity)
    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName SkinMaterial;

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ArmorMaterial;

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName WeaponMaterial;

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName ClothMaterial;

    UPROPERTY(EditDefaultsOnly, Category = "Materials")
    FName VFXMaterial;

    // Cloth physics
    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    bool bEnableClothPhysics = true;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothWindScale = 0.4f;

    UPROPERTY(EditDefaultsOnly, Category = "Cloth")
    float ClothGravityScale = 1.0f;

    // VFX socket bindings
    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName HandVFXSocket = "vfx_socket_Hands";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName GroundVFXSocket = "vfx_socket_Ground";

    UPROPERTY(EditDefaultsOnly, Category = "VFX")
    FName ChestVFXSocket = "vfx_socket_Chest";

    // Wing configuration
    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    bool bHasWings = false;

    UPROPERTY(EditDefaultsOnly, Category = "Wings")
    FName WingType = NAME_None; // "LightTether", "FalconFeather", "Shadow", "None"

    // Special flags
    UPROPERTY(EditDefaultsOnly, Category = "Special")
    bool bHasChainPhysics = false; // Izanami kusarigama

    UPROPERTY(EditDefaultsOnly, Category = "Special")
    bool bHasSpiritTranslucency = false; // All Kami deities

    UPROPERTY(EditDefaultsOnly, Category = "Special")
    bool bHasAntiLightShader = false; // All Infernal deities

    UPROPERTY(EditDefaultsOnly, Category = "Special")
    bool bIsDualWeapon = false; // Dagda, Morrigan, Brigid, Sutekh

    UPROPERTY(EditDefaultsOnly, Category = "Special")
    bool bIsTemplarStandard = false; // All Empyrean deities

    // Combat state (runtime)
    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float FactionResourceLevel = 0.0f;

    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    bool bOnFavoredGround = false;

    UPROPERTY(BlueprintReadOnly, Category = "Combat State")
    float DodgePhaseBlend = 0.0f;

    // Montage reference (set in editor)
    UPROPERTY(EditDefaultsOnly, Category = "Montages")
    TSoftObjectPtr<UAnimMontage> WeaponMontage;
};

// === DEITY DATA ASSET INSTANCES ===
// In UE5 editor, create one UMGDeityAnimData instance per deity with these configs:

// Iset (MG-DEITY-003, Aten Ra, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Amunet (MG-DEITY-009, Aten Ra, DualDagger)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Freyja (MG-DEITY-013, Asgardian, DualDagger)
// Wings: FalconFeather | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Izanami (MG-DEITY-031, Kami, DualDagger)
// Wings: None | Chain: True | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Raphael (MG-DEITY-048, Empyrean, DualDagger)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Skadi (MG-DEITY-012, Asgardian, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Artemis (MG-DEITY-021, Olympian, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Amaterasu (MG-DEITY-028, Kami, BowRanged)
// Wings: None | Chain: False | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Jophiel (MG-DEITY-049, Empyrean, BowRanged)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Lilith (MG-DEITY-057, Infernal Dominion, BowRanged)
// Wings: Shadow | Chain: False | Spirit: False | AntiLight: True | DualWeapon: False | Templar: False

// Athena (MG-DEITY-026, Olympian, SwordShield)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Morrigan (MG-DEITY-040, Tuatha, SwordShield)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Brigid (MG-DEITY-041, Tuatha, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Dagda (MG-DEITY-037, Tuatha, GreatWeapon)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False
