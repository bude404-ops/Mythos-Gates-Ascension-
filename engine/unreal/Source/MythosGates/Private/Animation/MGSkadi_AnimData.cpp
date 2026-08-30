#include "MGSkadi_AnimData.h"

const FName UMGSkadi_AnimData::DeityId = FName("MG-DEITY-012");
const FName UMGSkadi_AnimData::DeityName = FName("Skadi");
const FName UMGSkadi_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGSkadi_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-012_Skadi");

UMGSkadi_AnimData::GSkadi_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Skadi/M_Skadi_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Skadi/M_Skadi_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Skadi/M_Skadi_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Skadi/M_Skadi_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Skadi/M_Skadi_VFX");
}
