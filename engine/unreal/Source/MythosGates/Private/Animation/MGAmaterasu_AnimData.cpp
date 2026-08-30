#include "MGAmaterasu_AnimData.h"

const FName UMGAmaterasu_AnimData::DeityId = FName("MG-DEITY-028");
const FName UMGAmaterasu_AnimData::DeityName = FName("Amaterasu");
const FName UMGAmaterasu_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGAmaterasu_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-028_Amaterasu");

UMGAmaterasu_AnimData::GAmaterasu_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Amaterasu/M_Amaterasu_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Amaterasu/M_Amaterasu_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Amaterasu/M_Amaterasu_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Amaterasu/M_Amaterasu_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Amaterasu/M_Amaterasu_VFX");
}
