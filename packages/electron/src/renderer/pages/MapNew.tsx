import React, { useEffect, useState, useMemo } from "react";
import { PageLayout } from "../components/PageLayout";
import { DataChange } from "@rrox/types";
import { World } from '@rrox/types';
import { Map, MapActions, MapMode, MapSettings } from '@rrox/components';

export function MapNewPage() {

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
    } );

    const [ settings, setSettings ] = useState<MapSettings>( useMemo( getSettings, [] ) );
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
            setSettings( getSettings() );
        } );

        return () => {
            cleanup();
            cleanup2();
            cleanup3();
            cleanup4();
        }
    }, [] );

    const actions = useMemo<MapActions>( () => ( {
        teleport         : ( x, y, z ) => window.ipc.send( 'teleport', x, y, z ),
        changeSwitch     : ( id ) => window.ipc.send( 'change-switch', id ),
        setEngineControls: ( id, type, value ) => window.ipc.send( 'set-engine-controls', id, type, value ),
        getColor         : ( key ) => window.settingsStore.get( `colors.${key}` ) || '#000',
    } ), [ settings ] );

    return (
        <PageLayout>
            <Map
                data={mapData}
                settings={settings}
                actions={actions}
                mode={mode}
                controlEnabled={controlEnabled}
            />
        </PageLayout>
    );
}