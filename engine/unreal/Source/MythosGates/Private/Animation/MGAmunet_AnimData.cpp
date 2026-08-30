#include "MGAmunet_AnimData.h"

const FName UMGAmunet_AnimData::DeityId = FName("MG-DEITY-004");
const FName UMGAmunet_AnimData::DeityName = FName("Amunet");
const FName UMGAmunet_AnimData::WeaponAnimClass = FName("DualDagger");
const FName UMGAmunet_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-004_Amunet");

UMGAmunet_AnimData::GAmunet_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Amunet/M_Amunet_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Amunet/M_Amunet_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Amunet/M_Amunet_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Amunet/M_Amunet_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Amunet/M_Amunet_VFX");
}
