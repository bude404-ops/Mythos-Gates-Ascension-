#include "MGAthena_AnimData.h"

const FName UMGAthena_AnimData::DeityId = FName("MG-DEITY-020");
const FName UMGAthena_AnimData::DeityName = FName("Athena");
const FName UMGAthena_AnimData::WeaponAnimClass = FName("SwordShield");
const FName UMGAthena_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-020_Athena");

UMGAthena_AnimData::GAthena_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Athena/M_Athena_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Athena/M_Athena_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Athena/M_Athena_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Athena/M_Athena_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Athena/M_Athena_VFX");
}
