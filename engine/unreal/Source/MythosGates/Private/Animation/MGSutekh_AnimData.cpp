#include "MGSutekh_AnimData.h"

const FName UMGSutekh_AnimData::DeityId = FName("MG-DEITY-002");
const FName UMGSutekh_AnimData::DeityName = FName("Sutekh");
const FName UMGSutekh_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGSutekh_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-002_Sutekh");

UMGSutekh_AnimData::GSutekh_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Sutekh/M_Sutekh_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Sutekh/M_Sutekh_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Sutekh/M_Sutekh_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Sutekh/M_Sutekh_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Sutekh/M_Sutekh_VFX");
}
