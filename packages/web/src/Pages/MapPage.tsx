import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";

export function MapPage() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, controlEnabled } = useMapData();
    const [ settings ] = useSettings();

    // When this page loads, we refresh the map data
    useEffect( () => {
        if( !mapDataLoaded )
            refreshMapData();
    }, [] );
    
    // When the map data loads, we check if we have a selected player
    useEffect( () => {
        if( !mapDataLoaded )
            return;
        // If we do not have a selected player, or the selected player is not in the world
        // Then we redirect to the select player page
        if( !settings.selectedPlayer || !mapData.Players.some( ( p ) => p.Name === settings.selectedPlayer ) )
            navigate( `/${serverKey}/players` );
    }, [ mapDataLoaded, settings ] );

    const actions = useMemo<MapActions>( () => ( {
        teleport         : ( x, y, z ) => {
            socket.send( 'teleport', x, y, z, settings.selectedPlayer );
        },
        changeSwitch     : ( id ) => {
            socket.send( 'change-switch', id );
        },
        setEngineControls: ( id, type, value ) => {
            socket.send( 'set-engine-controls', id, type, value );
        },
        getColor         : ( key ) => '#000',
    } ), [ settings, socket ] );

    const mapSettings = useMemo<MapSettings>( () => ( {
        background   : settings.background,
        minimapCorner: 1,
        transparent  : false,
    } ), [ settings ] );

    return (
        <div className="page-container">
            <Map
                data={mapData}
                settings={mapSettings}
                actions={actions}
                mode={MapMode.NORMAL}
                controlEnabled={controlEnabled}
            />
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}