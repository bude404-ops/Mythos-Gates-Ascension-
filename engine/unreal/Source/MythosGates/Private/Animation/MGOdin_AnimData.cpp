#include "MGOdin_AnimData.h"

const FName UMGOdin_AnimData::DeityId = FName("MG-DEITY-010");
const FName UMGOdin_AnimData::DeityName = FName("Odin");
const FName UMGOdin_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGOdin_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-010_Odin");

UMGOdin_AnimData::GOdin_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Odin/M_Odin_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Odin/M_Odin_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Odin/M_Odin_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Odin/M_Odin_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Odin/M_Odin_VFX");
}
