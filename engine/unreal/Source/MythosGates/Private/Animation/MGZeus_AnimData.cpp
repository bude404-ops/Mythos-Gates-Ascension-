#include "MGZeus_AnimData.h"

const FName UMGZeus_AnimData::DeityId = FName("MG-DEITY-019");
const FName UMGZeus_AnimData::DeityName = FName("Zeus");
const FName UMGZeus_AnimData::WeaponAnimClass = FName("GreatWeapon");
const FName UMGZeus_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-019_Zeus");

UMGZeus_AnimData::GZeus_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Zeus/M_Zeus_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Zeus/M_Zeus_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Zeus/M_Zeus_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Zeus/M_Zeus_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Zeus/M_Zeus_VFX");
}
