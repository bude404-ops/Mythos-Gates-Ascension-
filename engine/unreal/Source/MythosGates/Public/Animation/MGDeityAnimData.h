#pragma once

#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "MGDeityAnimData.generated.h"

// Unified per-deity animation data assets for all 28 deities
// Phase 3 — Animation System (complete)
// Each deity gets its own data asset instance in the UE5 editor
// Weapon class drives montage selection, individuality comes from VFX and weapon mesh
//
// Per-deity header files: MG<Name>_AnimData.h (28 files)
// All use shared 87-bone master skeleton with IK chains
// 6 weapon animation classes: GreatWeapon, SwordShield, StaffCaster, SpearPolearm, BowRanged, DualDagger

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

// === ALL 28 DEITY DATA ASSET CONFIGS ===
// In UE5 editor, create one UMGDeityAnimData instance per deity:
//
// Aten-Ra (MG-DEITY-001, Aten Ra, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Sutekh (MG-DEITY-002, Aten Ra, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Iset (MG-DEITY-003, Aten Ra, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Amunet (MG-DEITY-004, Aten Ra, DualDagger)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Odin (MG-DEITY-010, Asgardian, StaffCaster)
// Wings: Feathered | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Thor (MG-DEITY-011, Asgardian, GreatWeapon)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Skadi (MG-DEITY-012, Asgardian, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Freyja (MG-DEITY-013, Asgardian, DualDagger)
// Wings: FalconFeather | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Zeus (MG-DEITY-019, Olympian, GreatWeapon)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Athena (MG-DEITY-020, Olympian, SwordShield)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Artemis (MG-DEITY-021, Olympian, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Ares (MG-DEITY-022, Olympian, SwordShield)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Amaterasu (MG-DEITY-028, Kami, BowRanged)
// Wings: None | Chain: False | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Tsukuyomi (MG-DEITY-029, Kami, SpearPolearm)
// Wings: None | Chain: False | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Susanoo (MG-DEITY-030, Kami, SwordShield)
// Wings: None | Chain: False | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Izanami (MG-DEITY-031, Kami, DualDagger)
// Wings: None | Chain: True | Spirit: True | AntiLight: False | DualWeapon: False | Templar: False

// Dagda (MG-DEITY-037, Tuatha, GreatWeapon)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Brigid (MG-DEITY-038, Tuatha, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Morrigan (MG-DEITY-039, Tuatha, SwordShield)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: True | Templar: False

// Lugh (MG-DEITY-040, Tuatha, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: False

// Michael (MG-DEITY-046, Empyrean, SwordShield)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Gabriel (MG-DEITY-047, Empyrean, StaffCaster)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Raphael (MG-DEITY-048, Empyrean, DualDagger)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Jophiel (MG-DEITY-049, Empyrean, BowRanged)
// Wings: LightTether | Chain: False | Spirit: False | AntiLight: False | DualWeapon: False | Templar: True

// Lucifer (MG-DEITY-055, Infernal Dominion, StaffCaster)
// Wings: None | Chain: False | Spirit: False | AntiLight: True | DualWeapon: False | Templar: False

// Asmodeus (MG-DEITY-056, Infernal Dominion, GreatWeapon)
// Wings: None | Chain: False | Spirit: False | AntiLight: True | DualWeapon: False | Templar: False

// Lilith (MG-DEITY-057, Infernal Dominion, DualDagger)
// Wings: Shadow | Chain: False | Spirit: False | AntiLight: True | DualWeapon: False | Templar: False

// Naamah (MG-DEITY-058, Infernal Dominion, BowRanged)
// Wings: None | Chain: False | Spirit: False | AntiLight: True | DualWeapon: False | Templar: False

