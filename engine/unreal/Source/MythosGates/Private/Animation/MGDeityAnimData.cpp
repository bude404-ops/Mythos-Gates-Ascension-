#include "MGDeityAnimData.h"

UMGDeityAnimData::UMGDeityAnimData()
{
    // Defaults — override per instance in UE5 editor
    HandVFXSocket = "vfx_socket_Hands";
    GroundVFXSocket = "vfx_socket_Ground";
    ChestVFXSocket = "vfx_socket_Chest";
    bEnableClothPhysics = true;
}
