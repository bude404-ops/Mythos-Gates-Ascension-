#include "MGAtenRa_AnimData.h"

const FName UMGAtenRa_AnimData::DeityId = FName("MG-DEITY-001");
const FName UMGAtenRa_AnimData::DeityName = FName("Aten-Ra");
const FName UMGAtenRa_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGAtenRa_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-001_AtenRa");

UMGAtenRa_AnimData::GAtenRa_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/AtenRa/M_AtenRa_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/AtenRa/M_AtenRa_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/AtenRa/M_AtenRa_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/AtenRa/M_AtenRa_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/AtenRa/M_AtenRa_VFX");
}
