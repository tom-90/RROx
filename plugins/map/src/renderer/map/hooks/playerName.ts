import { ShareMode, useBaseOptions, useShareMode } from "@rrox/api";
import { IWorld } from "@rrox-plugins/world/shared";
import { useMemo } from "react";

export function usePlayerName( world: IWorld | undefined ) {
    const mode = useShareMode();
    const options = useBaseOptions();

    return useMemo( () => {
        if( ( mode === ShareMode.HOST || mode === ShareMode.NONE ) && world && world.players.length > 0 )
            return world.players[ 0 ].name;
        else if( mode === ShareMode.CLIENT && options.playerName )
            return options.playerName;
        else
            return 'UNKNOWN';
    }, [ mode, world?.players, options.playerName ] );
}