import { ChangeSwitchCommunicator, IWorldSettings, SetControlsCommunicator, SetPlayerCheats, TeleportCommunicator, WorldSettings } from "@rrox-plugins/world/shared";
import { useHasCommunicatorAccess, useSettings } from "@rrox/api";
import { useMemo } from "react";

export function useMapSettings() {
    const [ worldSettings ] = useSettings( WorldSettings );

    const canTeleport = useHasCommunicatorAccess( TeleportCommunicator );
    const canControlEngines = useHasCommunicatorAccess( SetControlsCommunicator );
    const canCheat = useHasCommunicatorAccess( SetPlayerCheats );
    const canSetSwitch = useHasCommunicatorAccess( ChangeSwitchCommunicator );
    

    return useMemo<IWorldSettings>( () => {
        return {
            ...worldSettings,
            features: {
                ...worldSettings.features,
                controlEngines: worldSettings.features.controlEngines && canControlEngines,
                teleport: worldSettings.features.teleport && canTeleport,
                cheats: worldSettings.features.cheats && canCheat,
                controlSwitches: worldSettings.features.controlSwitches && canSetSwitch,
            }
        }
    }, [ worldSettings, canTeleport, canControlEngines, canCheat, canSetSwitch ] );
}