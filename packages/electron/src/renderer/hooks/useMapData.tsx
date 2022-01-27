import { MapMode, MapSettings } from "@rrox/components";
import { DataChange, World } from "@rrox/types";
import React, { useState, useMemo, useEffect, useContext } from "react";

export const MapDataContext = React.createContext<{
    mapData: World;
    settings: MapSettings & {
        playerName?: string;
    };
    mode: MapMode;
    controlEnabled: boolean;
    setSettings: React.Dispatch<React.SetStateAction<MapSettings & { playerName?: string; }>>
}>( null );

export function MapDataProvider( { children }: { children?: React.ReactNode } ) {
    
    const [ mapData, setMapData ] = useState<World>( {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Sandhouses : [],
        Industries : [],
    } );

    const getSettings = () => ( {
        background: window.settingsStore.get<number>( 'map.background' ),
        minimapCorner: window.settingsStore.get<number>( 'minimap.corner' ),
        transparent: window.settingsStore.get<boolean>( 'minimap.transparent' ),
        playerName: window.settingsStore.get<string>( 'multiplayer.client.playerName' ),
    } );

    const [ settings, setSettings ] = useState<MapSettings & { playerName?: string }>( useMemo( getSettings, [] ) );
    const [ mode, setMode ] = useState<MapMode>( window.mode === 'overlay' ? MapMode.MINIMAP : MapMode.NORMAL );
    const [ controlEnabled, setControlEnabled ] = useState( false );

    useEffect( () => {
        let data = { ...mapData };
        window.ipc.invoke( 'map-data' ).then( ( newData ) => {
            data = newData;
            setMapData( newData );
        } );

        const onUpdate = ( event: Electron.IpcRendererEvent, changes: DataChange[] ) => {
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

        const cleanup = window.ipc.on( 'map-update', onUpdate );

        const cleanup2 = window.ipc.on( 'set-mode', ( event, mode ) => {
            setMode( mode );
            setSettings( getSettings() );
        } );

        const cleanup3 = window.ipc.on( 'control-enabled', ( event, enabled ) => {
            setControlEnabled( enabled );
        } );

        const cleanup4 = window.ipc.on( 'settings-update', () => {
            document.body.setAttribute('data-theme', window.settingsStore.get( 'site.darkMode' ) ? 'dark' : 'light');
            
            setSettings( getSettings() );
        } );

        return () => {
            cleanup();
            cleanup2();
            cleanup3();
            cleanup4();
        }
    }, [] );

    return <MapDataContext.Provider
        value={{
            mapData,
            settings,
            mode,
            controlEnabled,
            setSettings
        }}
    >
        {children}
    </MapDataContext.Provider>
}

export function useMapData() {
    return useContext( MapDataContext );
}