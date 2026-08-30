#include "MGMorrigan_AnimData.h"

const FName UMGMorrigan_AnimData::DeityId = FName("MG-DEITY-039");
const FName UMGMorrigan_AnimData::DeityName = FName("Morrigan");
const FName UMGMorrigan_AnimData::WeaponAnimClass = FName("SwordShield");
const FName UMGMorrigan_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-039_Morrigan");

UMGMorrigan_AnimData::GMorrigan_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Morrigan/M_Morrigan_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Morrigan/M_Morrigan_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Morrigan/M_Morrigan_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Morrigan/M_Morrigan_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Morrigan/M_Morrigan_VFX");
}
