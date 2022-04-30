import { BaseOptionsContext as BaseOptionsContextType, useSettings } from "@rrox/api";
import React, { useMemo } from "react";
import { BaseRendererSettings } from "../../settings";

export const BaseOptionsContext = React.createContext<BaseOptionsContextType>( {} );

export function BaseOptionsContextProvider( { children }: { children?: React.ReactNode }) {
    const [ settings ] = useSettings( BaseRendererSettings );

    const value = useMemo( () => {
        return {
            playerName: settings[ 'player-name' ]
        }
    }, [ settings[ 'player-name' ] ])

    return <BaseOptionsContext.Provider value={value}>
        {children}
    </BaseOptionsContext.Provider>;
}