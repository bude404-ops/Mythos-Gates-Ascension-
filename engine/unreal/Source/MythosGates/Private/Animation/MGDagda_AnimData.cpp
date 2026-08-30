#include "MGDagda_AnimData.h"

const FName UMGDagda_AnimData::DeityId = FName("MG-DEITY-037");
const FName UMGDagda_AnimData::DeityName = FName("Dagda");
const FName UMGDagda_AnimData::WeaponAnimClass = FName("GreatWeapon");
const FName UMGDagda_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-037_Dagda");

UMGDagda_AnimData::GDagda_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Dagda/M_Dagda_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Dagda/M_Dagda_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Dagda/M_Dagda_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Dagda/M_Dagda_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Dagda/M_Dagda_VFX");
}
