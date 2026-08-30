#include "MGIzanami_AnimData.h"

const FName UMGIzanami_AnimData::DeityId = FName("MG-DEITY-031");
const FName UMGIzanami_AnimData::DeityName = FName("Izanami");
const FName UMGIzanami_AnimData::WeaponAnimClass = FName("DualDagger");
const FName UMGIzanami_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-031_Izanami");

UMGIzanami_AnimData::GIzanami_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Izanami/M_Izanami_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Izanami/M_Izanami_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Izanami/M_Izanami_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Izanami/M_Izanami_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Izanami/M_Izanami_VFX");
}
