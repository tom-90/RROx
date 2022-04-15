import { AttachedContext as AttachedContextType, useListener, useRPC } from "@rrox/api";
import React, { useEffect, useState } from "react";
import { AttachedCommunicator, Log } from "../../../shared";

export const AttachedContext = React.createContext<AttachedContextType>( false );

export function AttachedContextProvider( { children }: { children?: React.ReactNode }) {
    const [ attached, setAttached ] = useState( false );

    useListener( AttachedCommunicator, ( attached ) => {
        setAttached( attached );
    } );
    
    const getAttachedState = useRPC( AttachedCommunicator );

    useEffect( () => {
        getAttachedState()
            .then( ( attached ) => setAttached( attached ) )
            .catch( ( e ) => Log.error( 'Failed to read attached value from communicator', e ) );
    }, [] );

    return <AttachedContext.Provider value={attached}>
        {children}
    </AttachedContext.Provider>;
}