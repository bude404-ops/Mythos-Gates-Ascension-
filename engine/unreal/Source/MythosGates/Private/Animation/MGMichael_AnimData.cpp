#include "MGMichael_AnimData.h"

const FName UMGMichael_AnimData::DeityId = FName("MG-DEITY-046");
const FName UMGMichael_AnimData::DeityName = FName("Michael");
const FName UMGMichael_AnimData::WeaponAnimClass = FName("SwordShield");
const FName UMGMichael_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-046_Michael");

UMGMichael_AnimData::GMichael_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Michael/M_Michael_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Michael/M_Michael_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Michael/M_Michael_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Michael/M_Michael_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Michael/M_Michael_VFX");
}
