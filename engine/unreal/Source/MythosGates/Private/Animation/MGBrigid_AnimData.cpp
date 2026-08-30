#include "MGBrigid_AnimData.h"

const FName UMGBrigid_AnimData::DeityId = FName("MG-DEITY-038");
const FName UMGBrigid_AnimData::DeityName = FName("Brigid");
const FName UMGBrigid_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGBrigid_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-038_Brigid");

UMGBrigid_AnimData::GBrigid_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Brigid/M_Brigid_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Brigid/M_Brigid_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Brigid/M_Brigid_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Brigid/M_Brigid_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Brigid/M_Brigid_VFX");
}
