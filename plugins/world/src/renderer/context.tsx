import { useValue } from "@rrox/api";
import React, { createContext, useContext } from "react";
import { IWorld, WorldCommunicator } from "../shared";

export const WorldContext = createContext<IWorld | undefined>( undefined );

export function useWorld() {
    return useContext( WorldContext );
}

export function WorldProvider( { children }: { children?: React.ReactNode } ) {
    const world = useValue( WorldCommunicator );

    return <WorldContext.Provider value={world}>
        {children}
    </WorldContext.Provider>;
}