#include "MGAres_AnimData.h"

const FName UMGAres_AnimData::DeityId = FName("MG-DEITY-022");
const FName UMGAres_AnimData::DeityName = FName("Ares");
const FName UMGAres_AnimData::WeaponAnimClass = FName("SwordShield");
const FName UMGAres_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-022_Ares");

UMGAres_AnimData::GAres_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Ares/M_Ares_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Ares/M_Ares_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Ares/M_Ares_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Ares/M_Ares_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Ares/M_Ares_VFX");
}
