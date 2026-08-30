#include "MGLugh_AnimData.h"

const FName UMGLugh_AnimData::DeityId = FName("MG-DEITY-040");
const FName UMGLugh_AnimData::DeityName = FName("Lugh");
const FName UMGLugh_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGLugh_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-040_Lugh");

UMGLugh_AnimData::GLugh_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Lugh/M_Lugh_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Lugh/M_Lugh_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Lugh/M_Lugh_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Lugh/M_Lugh_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Lugh/M_Lugh_VFX");
}
