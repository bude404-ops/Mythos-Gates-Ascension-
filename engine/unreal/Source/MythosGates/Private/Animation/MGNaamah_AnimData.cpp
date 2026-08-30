#include "MGNaamah_AnimData.h"

const FName UMGNaamah_AnimData::DeityId = FName("MG-DEITY-058");
const FName UMGNaamah_AnimData::DeityName = FName("Naamah");
const FName UMGNaamah_AnimData::WeaponAnimClass = FName("BowRanged");
const FName UMGNaamah_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-058_Naamah");

UMGNaamah_AnimData::GNaamah_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Naamah/M_Naamah_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Naamah/M_Naamah_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Naamah/M_Naamah_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Naamah/M_Naamah_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Naamah/M_Naamah_VFX");
}
