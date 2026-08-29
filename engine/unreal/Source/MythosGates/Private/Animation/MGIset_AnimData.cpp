#include "MGIset_AnimData.h"

const FName UMGIset_AnimData::DeityId = FName("MG-DEITY-003");
const FName UMGIset_AnimData::DeityName = FName("Iset");
const FName UMGIset_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGIset_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-003_Iset");

UMGIset_AnimData::UMGIset_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Iset/M_Iset_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Iset/M_Iset_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Iset/M_Iset_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Iset/M_Iset_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Iset/M_Iset_VFX");
}
