#include "MGSusanoo_AnimData.h"

const FName UMGSusanoo_AnimData::DeityId = FName("MG-DEITY-030");
const FName UMGSusanoo_AnimData::DeityName = FName("Susanoo");
const FName UMGSusanoo_AnimData::WeaponAnimClass = FName("SwordShield");
const FName UMGSusanoo_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-030_Susanoo");

UMGSusanoo_AnimData::GSusanoo_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Susanoo/M_Susanoo_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Susanoo/M_Susanoo_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Susanoo/M_Susanoo_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Susanoo/M_Susanoo_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Susanoo/M_Susanoo_VFX");
}
