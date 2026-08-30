#include "MGThor_AnimData.h"

const FName UMGThor_AnimData::DeityId = FName("MG-DEITY-011");
const FName UMGThor_AnimData::DeityName = FName("Thor");
const FName UMGThor_AnimData::WeaponAnimClass = FName("GreatWeapon");
const FName UMGThor_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-011_Thor");

UMGThor_AnimData::GThor_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Thor/M_Thor_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Thor/M_Thor_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Thor/M_Thor_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Thor/M_Thor_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Thor/M_Thor_VFX");
}
