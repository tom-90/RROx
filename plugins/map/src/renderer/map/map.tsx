import { IPlayer, IWorld, SplineType } from "@rrox-plugins/world/shared";
import React, { useCallback, useContext, useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, LayersControl, Pane, LayerGroup } from "react-leaflet";
import { MapContext } from "./context";
import { Background, Frame, Industry, Player, Sandhouse, Splines, Switch, Turntable, WaterTower } from "./elements";
import { ContextMenu, Controls, Line } from "./leaflet";
import { MapMode } from "./types";
import { SearchPopup } from "./popups";

export function Map( { data, setMap }: {
    data: IWorld,
    setMap: ( map: L.Map ) => void,
}) {
    const { config, mode, follow, utils, preferences, currentPlayerName } = useContext( MapContext )!;

    const [ searchVisible, setSearchVisible ] = useState(false);
    
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
            <Pane name='background' style={{ zIndex: 0 }}>
                <Line
                    positions={[
                        config.map.bounds.getNorthWest(),
                        config.map.bounds.getNorthEast(),
                        config.map.bounds.getSouthEast(),
                        config.map.bounds.getSouthWest(),
                        config.map.bounds.getNorthWest(),
                    ]}
                    color={'black'}
                    weight={1000}
                    opacity={mode === MapMode.MINIMAP && preferences.minimap.transparent ? 0 : 1}
                />
                <Background />
            </Pane>
            <Pane name='groundwork' style={{ zIndex: 10 }}>
                <LayersControl.Overlay name="Groundwork" checked>
                    <LayerGroup>
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.CONSTANT_BANK )}
                            type={SplineType.CONSTANT_BANK}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.VARIABLE_BANK )}
                            type={SplineType.VARIABLE_BANK}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.CONSTANT_WALL )}
                            type={SplineType.CONSTANT_WALL}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.VARIABLE_WALL )}
                            type={SplineType.VARIABLE_WALL}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.WOODEN_BRIDGE )}
                            type={SplineType.WOODEN_BRIDGE}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.IRON_BRIDGE )}
                            type={SplineType.IRON_BRIDGE}
                        />
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='industries' style={{ zIndex: 20 }}>
                <LayersControl.Overlay name="Industries" checked>
                    <LayerGroup>
                        {data.industries.map( ( s, i ) => <Industry data={s} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='sandhouses' style={{ zIndex: 30 }}>
                <LayersControl.Overlay name="Sandhouses" checked>
                    <LayerGroup>
                        {data.sandhouses.map( ( s, i ) => <Sandhouse data={s} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='watertowers' style={{ zIndex: 40 }}>
                <LayersControl.Overlay name="Watertowers" checked>
                    <LayerGroup>
                        {data.watertowers.map( ( s, i ) => <WaterTower data={s} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='track' style={{ zIndex: 50 }}>
                <LayersControl.Overlay name="Tracks" checked>
                    <LayerGroup>
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.TRACK )}
                            type={SplineType.TRACK}
                        />
                        <Splines
                            data={data.splines.filter( ( s ) => s.type === SplineType.TRENDLE_TRACK )}
                            type={SplineType.TRENDLE_TRACK}
                        />
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='turntables' style={{ zIndex: 60 }}>
                <LayersControl.Overlay name="Turntables" checked>
                    <LayerGroup>
                        {data.turntables.map( ( s, i ) => <Turntable data={s} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='switches' style={{ zIndex: 70 }}>
                <LayersControl.Overlay name="Switches" checked>
                    <LayerGroup>
                        {data.switches.map( ( s, i ) => <Switch data={s} index={i} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='frames' style={{ zIndex: 80 }}>
                <LayersControl.Overlay name="Locomotives and Carts" checked>
                    <LayerGroup>
                        {data.frameCars.map( ( s, i ) => <Frame data={s} index={i} frames={data.frameCars} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='players' style={{ zIndex: 90 }}>
                <LayersControl.Overlay name="Players" checked>
                    <LayerGroup>
                        {data.players.map( ( s, i ) => <Player data={s} index={i} key={i} /> )}
                    </LayerGroup>
                </LayersControl.Overlay>
            </Pane>
            <Pane name='popups' style={{ zIndex: 100 }} />
        </LayersControl>
        <ContextMenu />
        <SearchPopup
            data={data}
            visible={searchVisible}
            setVisible={( visible ) => setSearchVisible(visible)}
        />
    </MapContainer>;
}