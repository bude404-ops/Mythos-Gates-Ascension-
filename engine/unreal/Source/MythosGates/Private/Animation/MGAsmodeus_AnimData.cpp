#include "MGAsmodeus_AnimData.h"

const FName UMGAsmodeus_AnimData::DeityId = FName("MG-DEITY-056");
const FName UMGAsmodeus_AnimData::DeityName = FName("Asmodeus");
const FName UMGAsmodeus_AnimData::WeaponAnimClass = FName("GreatWeapon");
const FName UMGAsmodeus_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-056_Asmodeus");

UMGAsmodeus_AnimData::GAsmodeus_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Asmodeus/M_Asmodeus_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Asmodeus/M_Asmodeus_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Asmodeus/M_Asmodeus_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Asmodeus/M_Asmodeus_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Asmodeus/M_Asmodeus_VFX");
}
