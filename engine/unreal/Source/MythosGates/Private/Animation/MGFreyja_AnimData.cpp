#include "MGFreyja_AnimData.h"

const FName UMGFreyja_AnimData::DeityId = FName("MG-DEITY-013");
const FName UMGFreyja_AnimData::DeityName = FName("Freyja");
const FName UMGFreyja_AnimData::WeaponAnimClass = FName("DualDagger");
const FName UMGFreyja_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-013_Freyja");

UMGFreyja_AnimData::GFreyja_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Freyja/M_Freyja_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Freyja/M_Freyja_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Freyja/M_Freyja_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Freyja/M_Freyja_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Freyja/M_Freyja_VFX");
}
