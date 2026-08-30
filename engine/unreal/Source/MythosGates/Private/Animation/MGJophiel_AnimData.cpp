#include "MGJophiel_AnimData.h"

const FName UMGJophiel_AnimData::DeityId = FName("MG-DEITY-049");
const FName UMGJophiel_AnimData::DeityName = FName("Jophiel");
const FName UMGJophiel_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGJophiel_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-049_Jophiel");

UMGJophiel_AnimData::GJophiel_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Jophiel/M_Jophiel_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Jophiel/M_Jophiel_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Jophiel/M_Jophiel_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Jophiel/M_Jophiel_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Jophiel/M_Jophiel_VFX");
}
