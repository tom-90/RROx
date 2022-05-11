import { IPlayer, IWorld } from "@rrox-plugins/world/shared";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, LayersControl } from "react-leaflet";
import { MapContext } from "./context";
import { ContextMenu, Controls, Line } from "./leaflet";
import { MapMode } from "./types";
import { SearchPopup } from "./popups";
import { useRegistration } from "@rrox/api";
import { MapLayerRegistration } from "./registrations/layer";
import { MapElementRegistration } from "./registrations";

export function Map( { data, setMap }: {
    data: IWorld,
    setMap: ( map: L.Map ) => void,
}) {
    const { config, mode, follow, utils, currentPlayerName } = useContext( MapContext )!;

    const [ searchVisible, setSearchVisible ] = useState(false);

    const mapLayers = useRegistration( MapLayerRegistration );

    const panes = useMemo( () => {
        return mapLayers.map( ( p ) => p.parameters[ 0 ] );
    }, [ mapLayers ] );

    const mapElements = useRegistration( MapElementRegistration );

    const elements = useMemo( () => {
        return mapElements.map( ( p ) => p.parameters[ 0 ] );
    }, [ mapElements ] );
    
    const startFollowing = useCallback( () => {
        if( mode === MapMode.NORMAL )
            return;

        const index = data.players.findIndex( ( p ) => p.name === currentPlayerName );

        if( index >= 0 )
            follow.setFollowing( {
                array: 'players',
                index,
                apply: ( data: IPlayer, map: L.Map ) => {
                    map.panTo(
                        L.latLng( ...utils.scaleLocation( data.location ) ),
                        { animate: true, duration: 0.5 }
                    );
                }
            } );
    }, [ data.players, currentPlayerName, mode ] );

    useEffect( () => {
        if ( data.players.length > 0 )
            startFollowing();
    }, [ data.players.length > 0, currentPlayerName ] );

    return <MapContainer
        center={config.map.center}
        bounds={config.map.bounds}
        zoom={config.map.initialZoom}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        whenCreated={( map ) => {
            setMap( map );
            startFollowing();
        }}
    >
        <Controls
            showFocusPlayer={data.players.length > 0 ? ( follow.following?.array != null && follow.following?.index != null ? 2 : 1 ) : false}
            onFocusPlayer={() => follow.setFollowing(
                follow.following?.array != null && follow.following?.index != null
                    ? null
                    : {
                        array: 'players',
                        index: data.players.findIndex( ( p ) => p.name === currentPlayerName ) || 0,
                        apply: ( data: IPlayer, map: L.Map ) => {
                            map.panTo(
                                L.latLng( ...utils.scaleLocation( data.location ) ),
                                { animate: true, duration: 0.5 }
                            );
                        }
                    }
            )}
            onSearchShow={() => {
                setSearchVisible(true);
            }}
        />
        <LayersControl>
            {panes}
        </LayersControl>
        <ContextMenu />
        <SearchPopup
            data={data}
            visible={searchVisible}
            setVisible={( visible ) => setSearchVisible(visible)}
        />
        {elements}
    </MapContainer>;
}