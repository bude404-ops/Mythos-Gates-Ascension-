#include "MGLucifer_AnimData.h"

const FName UMGLucifer_AnimData::DeityId = FName("MG-DEITY-055");
const FName UMGLucifer_AnimData::DeityName = FName("Lucifer");
const FName UMGLucifer_AnimData::WeaponAnimClass = FName("StaffCaster");
const FName UMGLucifer_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-055_Lucifer");

UMGLucifer_AnimData::GLucifer_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Lucifer/M_Lucifer_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Lucifer/M_Lucifer_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Lucifer/M_Lucifer_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Lucifer/M_Lucifer_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Lucifer/M_Lucifer_VFX");
}
