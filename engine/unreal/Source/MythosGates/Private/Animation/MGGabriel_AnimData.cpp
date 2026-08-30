#include "MGGabriel_AnimData.h"

const FName UMGGabriel_AnimData::DeityId = FName("MG-DEITY-047");
const FName UMGGabriel_AnimData::DeityName = FName("Gabriel");
const FName UMGGabriel_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGGabriel_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-047_Gabriel");

UMGGabriel_AnimData::GGabriel_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Gabriel/M_Gabriel_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Gabriel/M_Gabriel_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Gabriel/M_Gabriel_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Gabriel/M_Gabriel_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Gabriel/M_Gabriel_VFX");
}
