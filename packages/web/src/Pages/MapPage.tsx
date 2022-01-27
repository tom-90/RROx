import * as React from "react";
import {useEffect, useMemo} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Map, MapMode, MapSettings} from "@rrox/components";
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";

export function MapPage() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, features, actions: actions } = useMapData();
    const [ settings ] = useSettings();

    // When this page loads, we refresh the map data
    useEffect( () => {
        if( !mapDataLoaded )
            refreshMapData();
    }, [] );
    
    // When the map data loads, we check if we have a selected player
    useEffect( () => {
        // If we do not have a selected player, or the selected player is not in the world
        // Then we redirect to the select player page
        if( mapData.Players.length > 0 && ( !settings[ 'multiplayer.client.playerName' ] || !mapData.Players.some( ( p ) => p.Name === settings[ 'multiplayer.client.playerName' ] ) ) )
            navigate( `/${serverKey}/players` );
    }, [ mapData, settings ] );

    const mapSettings = useMemo<MapSettings>( () => ( {
        background   : settings[ 'map.background' ],
        minimapCorner: 1,
        transparent  : false,
    } ), [ settings ] );

    return (
        <MapPageLayout>
            <Map
                data={mapData}
                settings={mapSettings}
                actions={actions}
                mode={MapMode.NORMAL}
                features={features}
            />
        </MapPageLayout>
    );
}