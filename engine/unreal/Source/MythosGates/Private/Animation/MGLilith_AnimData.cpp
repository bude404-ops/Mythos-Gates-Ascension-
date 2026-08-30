#include "MGLilith_AnimData.h"

const FName UMGLilith_AnimData::DeityId = FName("MG-DEITY-057");
const FName UMGLilith_AnimData::DeityName = FName("Lilith");
const FName UMGLilith_AnimData::WeaponAnimClass = FName("DualDagger");
const FName UMGLilith_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-057_Lilith");

UMGLilith_AnimData::GLilith_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Lilith/M_Lilith_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Lilith/M_Lilith_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Lilith/M_Lilith_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Lilith/M_Lilith_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Lilith/M_Lilith_VFX");
}
