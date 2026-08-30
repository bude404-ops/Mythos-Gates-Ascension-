#include "MGArtemis_AnimData.h"

const FName UMGArtemis_AnimData::DeityId = FName("MG-DEITY-021");
const FName UMGArtemis_AnimData::DeityName = FName("Artemis");
const FName UMGArtemis_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGArtemis_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-021_Artemis");

UMGArtemis_AnimData::GArtemis_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Artemis/M_Artemis_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Artemis/M_Artemis_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Artemis/M_Artemis_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Artemis/M_Artemis_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Artemis/M_Artemis_VFX");
}
