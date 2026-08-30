#include "MGRaphael_AnimData.h"

const FName UMGRaphael_AnimData::DeityId = FName("MG-DEITY-048");
const FName UMGRaphael_AnimData::DeityName = FName("Raphael");
const FName UMGRaphael_AnimData::WeaponAnimClass = FName("DualDagger");
const FName UMGRaphael_AnimData::MeshPath = FName("/Game/Meshes/Deities/MG-DEITY-048_Raphael");

UMGRaphael_AnimData::GRaphael_AnimData()
{
    SkinMaterial = FName("/Game/Materials/Deities/Raphael/M_Raphael_Skin");
    ArmorMaterial = FName("/Game/Materials/Deities/Raphael/M_Raphael_Armor");
    WeaponMaterial = FName("/Game/Materials/Deities/Raphael/M_Raphael_Weapon");
    ClothMaterial = FName("/Game/Materials/Deities/Raphael/M_Raphael_Cloth");
    VFXMaterial = FName("/Game/Materials/Deities/Raphael/M_Raphael_VFX");
}
