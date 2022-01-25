import React, { useMemo, useContext } from "react";
import { PageLayout } from "../components/PageLayout";
import { AttachContext } from "../utils/attach";
import { AttachedState } from "@rrox/types";
import { Map, MapActions, PlayerSelector } from '@rrox/components';
import { useMapData } from "../hooks/useMapData";

export function MapPage() {
    const { status, mode: attachMode } = useContext( AttachContext );

    const { controlEnabled, mapData, mode, settings, setSettings } = useMapData();

    const actions = useMemo<MapActions>( () => ( {
        teleport             : ( x, y, z ) => window.ipc.send( 'teleport', x, y, z, attachMode === 'client' ? settings.playerName : undefined ),
        changeSwitch         : ( id ) => window.ipc.send( 'change-switch', id ),
        setCheats            : ( name, walkSpeed, flySpeed ) => window.ipc.send( 'set-cheats', name, walkSpeed, flySpeed ),
        setEngineControls    : ( id, type, value ) => window.ipc.send( 'set-engine-controls', id, type, value ),
        setControlsSynced    : ( id, enabled ) => window.ipc.send( 'set-sync-controls', id, enabled ),
        setMoneyAndXP        : ( name, money, xp ) => window.ipc.send( 'set-money-and-xp', name, money, xp ),
        getColor             : ( key ) => window.settingsStore.get( `colors.${key}` ) || '#000',
        getSelectedPlayerName: () => attachMode === 'client' ? settings.playerName : undefined,
        buildSplines         : ( splines, simulate ) => window.ipc.invoke( 'build-spline', splines, simulate ),
        openNewTab           : ( url ) => window.openBrowser( url ),
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
            {!settings.playerName && attachMode === 'client' && mapData.Players.length > 0 && status === AttachedState.ATTACHED && <PlayerSelector
                players={mapData.Players}
                onSelect={( playerName ) => {
                    window.settingsStore.set( 'multiplayer.client.playerName', playerName );
                    setSettings( {
                        ...settings,
                        playerName
                    } );
                    
                    window.ipc.send( 'update-config' );
                }}
            />}
        </PageLayout>
    );
}