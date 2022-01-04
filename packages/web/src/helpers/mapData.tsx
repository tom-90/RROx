import { DataChange, World } from "@rrox/types";
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useSocket } from "./socket";

export const MapDataContext = createContext<{
    data   : World;
    refresh: () => void;
    clear  : () => void;
    loaded : boolean;
    controlEnabled: boolean;
}>( null );

export function useMapData() {
    const context = useContext( MapDataContext );

    return context;
}

export function MapDataProvider( { children }: { children?: React.ReactNode } ) {

    const emptyData: World = {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Sandhouses : [],
        Industries : [],
    };

    const [ mapData, setMapData ] = useState( emptyData );
    const [ loaded , setLoaded  ] = useState( false );

    const [ controlEnabled, setControlEnabled ] = useState( true );

    const socket = useSocket();

    useEffect( () => {
        let data = { ...mapData };

        const onMapUpdate = ( changes: DataChange[] ) => {
            data = { ...data };

            // We sort the indices in reverse order, such that we can safely remove all of them
            changes = changes.sort( ( a, b ) => b.Index - a.Index );

            changes.forEach( ( c ) => {
                let array = data[ c.Array as keyof typeof mapData ];

                if( c.ChangeType === 'ADD' || c.ChangeType === 'UPDATE' )
                    array[ c.Index ] = c.Data! as any;
                else if( c.ChangeType === 'REMOVE' )
                    array.splice( c.Index, 1 );
            } );

            setMapData( data );
        };

        const onControlEnabled = ( enabled: boolean ) => {
            setControlEnabled( enabled );
        };

        const onLeave = () => {
            setMapData( emptyData );
            setLoaded( false );
        };

        socket.on( 'map-update'     , onMapUpdate      );
        socket.on( 'control-enabled', onControlEnabled );
        socket.on( 'leave'          , onLeave          );

        // Callback function that gets called when the component disappears
        // So this contains all cleanup logic (removing event listeners)
        return () => {
            socket.removeListener( 'map-update'     , onMapUpdate      );
            socket.removeListener( 'control-enabled', onControlEnabled );
            socket.removeListener( 'leave'          , onLeave          );
        };
    }, [ socket, mapData ] );

    const refresh = useMemo( () => {
        return () => {
            socket.invoke( 'map-data' ).then( ( data: World ) => {
                setMapData( data );
                setLoaded( true );
            } ).catch( ( e ) => {
                console.log( 'Failed retrieving map data', e );
            } );
        };
    }, [ socket ] );

    const clear = useMemo( () => {
        return () => {
            setMapData( emptyData );
            setLoaded( false );
        };
    }, [] );

    return <MapDataContext.Provider value={{
        data: mapData,
        refresh,
        clear,
        loaded,
        controlEnabled
    }}>
        {children}
    </MapDataContext.Provider>;
}