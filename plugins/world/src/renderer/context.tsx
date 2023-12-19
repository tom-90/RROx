import { useValue } from "@rrox/api";
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { IWorld, WorldCommunicator } from "../shared";

export const WorldContext = createContext<IWorld | undefined>( undefined );

export function useWorld() {
    return useContext( WorldContext );
}

export function WorldProvider( { children }: { children?: React.ReactNode } ) {
    const world = useValue( WorldCommunicator ) as Partial<IWorld> | undefined;

    const fullWorld: IWorld = useMemo<IWorld>( () => {
        const fullWorld = {
            frameCars: world?.frameCars ?? [],
            industries: world?.industries ?? [],
            players: world?.players ?? [],
            sandhouses: world?.sandhouses ?? [],
            splines: world?.splines ?? [],
            switches: world?.switches ?? [],
            turntables: world?.turntables ?? [],
            watertowers: world?.watertowers ?? [],
            splineTracks: world?.splineTracks ?? [],
        };

        // console.log( fullWorld );

        return fullWorld;
    }, [ world ] );

    return <WorldContext.Provider value={fullWorld}>
        {children}
    </WorldContext.Provider>;
}