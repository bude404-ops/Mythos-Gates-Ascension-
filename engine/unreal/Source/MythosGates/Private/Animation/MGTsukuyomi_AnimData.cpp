#include "MGTsukuyomi_AnimData.h"

const FName UMGTsukuyomi_AnimData::DeityId = FName("MG-DEITY-029");
const FName UMGTsukuyomi_AnimData::DeityName = FName("Tsukuyomi");
const FName UMGTsukuyomi_AnimData::WeaponAnimClass = FName("SpearPolearm");
const FName UMGTsukuyomi_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-029_Tsukuyomi");

UMGTsukuyomi_AnimData::GTsukuyomi_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Tsukuyomi/M_Tsukuyomi_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Tsukuyomi/M_Tsukuyomi_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Tsukuyomi/M_Tsukuyomi_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Tsukuyomi/M_Tsukuyomi_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Tsukuyomi/M_Tsukuyomi_VFX");
}
