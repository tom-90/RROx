import React, { useState, useMemo, useEffect } from 'react';
import { LayerGroup, LayersControl, MapContainer, Pane } from 'react-leaflet';
import L from 'leaflet';
import { MapContext, MapContextData, MapMode, MapSettings, MapActions } from './context';
import { Background } from './background';
import { World } from '@rrox/types';
import { Splines } from './elements/Splines';
import { Switch } from './elements/Switch';
import { SplineType } from '@rrox/types';
import { Industry } from './elements/Industry';
import { Player } from './elements/Player';
import { Turntable } from './elements/Turntable';
import { Frame } from './elements/Frame';
import { Sandhouse } from './elements/Sandhouse';
import { WaterTower } from './elements/WaterTower';
import { Controls } from './leaflet/controls';
import './styles.less';

export function Map( { data, settings, actions, mode, controlEnabled }: {
    data          : World,
    settings      : MapSettings,
    actions       : MapActions,
    mode          : MapMode,
    controlEnabled: boolean,
} ) {
    const [ following, setFollowing ] = useState<{ array: keyof World, id: number } | null>( null );
    const [ map, setMap ] = useState<L.Map>();

    const followEnabled = mode !== MapMode.MAP;

    useEffect( () => {
        if( !map )
            return;

        const isFollowing = followEnabled && following?.array != null && following?.id != null

        if ( map.dragging.enabled() && isFollowing )
            map.dragging.disable();
        else if ( !map.dragging.enabled() && !isFollowing )
            map.dragging.enable();
        
        if ( map.options.scrollWheelZoom === true && isFollowing )
            map.options.scrollWheelZoom = 'center';
        else if ( map.options.scrollWheelZoom !== true && !isFollowing )
            map.options.scrollWheelZoom = true;
    }, [ followEnabled, following?.array, following?.id ] );

    useEffect( () => {
        if( !map )
            return;

        const timeout = setTimeout( () => map?.invalidateSize(), 500 );

        return () => clearTimeout( timeout );
    }, [ mode ] );

    const mapProps = useMemo<MapContextData[ 'map' ]>( () => {
        // Game coordinate range
        const minX = -200000;
        const maxX = 200000;
        const minY = -200000;
        const maxY = 200000;

        return {
            bounds     : L.latLngBounds( L.latLng( minX, minY ), L.latLng( maxX, maxY ) ),
            center     : L.latLng( 0, 0 ),
            initialZoom: -5,
            minZoom    : -10,
            maxZoom    : 0,
            scale      : 1,
        };
    }, [] );

    const utils = useMemo<MapContextData[ 'utils' ]>( () => {
        return {
            scaleNumber     : ( num: number ) => num / mapProps.scale,
            scalePoint      : ( x  , y   ) => [ y, -x ],
            revertScalePoint: ( lat, lng ) => [ -lng, lat ],

            rotate: ( cx, cy, x, y, angle ) => {
                let radians = ( Math.PI / 180 ) * -angle,
                    cos = Math.cos( radians ),
                    sin = Math.sin( radians ),
                    nx = ( cos * ( x - cx ) ) + ( sin * ( y - cy ) ) + cx,
                    ny = ( cos * ( y - cy ) ) - ( sin * ( x - cx ) ) + cy;
                return [ nx, ny ];
            },
        }
    }, [] );

    return <MapContext.Provider
        value={{
            settings,
            map: mapProps,
            actions,
            mode,
            utils,
            controlEnabled,
            follow: {
                array  : following?.array,
                id     : following?.id,
                enabled: followEnabled,

                setFollowing( array, id ) {
                    if( array == null || id == null )
                        setFollowing( null );
                    else
                        setFollowing( { array, id } );
                }
            }
        }}
    >
        <div className={[ 'map', `map-${mode}`, `corner-${settings.minimapCorner}` ].join( ' ' )}>
            <MapContainer
                center={mapProps.center}
                bounds={mapProps.bounds}
                zoom={mapProps.initialZoom}
                minZoom={mapProps.minZoom}
                maxZoom={mapProps.maxZoom}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
                whenCreated={( map ) => {
                    setMap( map );
                    if( mode !== MapMode.NORMAL )
                        setFollowing( { array: 'Players', id: 0 } );

                    // @ts-ignore
                    window.map = map;
                }}
                crs={L.CRS.Simple}
            >
                <Background />
                <Controls
                    showFocusPlayer={data.Players.length > 0 ? ( following?.array != null && following?.id != null ? 2 : 1 ) : false}
                    onFocusPlayer={() => setFollowing( following?.array != null && following?.id != null ? null : { array: 'Players', id: data.Players[ 0 ].ID } )}
                />
                <LayersControl>
                    {/*<Pane name='background' style={{ zIndex: 0 }}>
                        <Background />
                    </Pane>*/}
                    <Pane name='groundwork' style={{ zIndex: 10 }}>
                        <LayersControl.Overlay name="Groundwork" checked>
                            <LayerGroup>
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.CONSTANT_BANK )}
                                    type={SplineType.CONSTANT_BANK}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.VARIABLE_BANK )}
                                    type={SplineType.VARIABLE_BANK}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.CONSTANT_WALL )}
                                    type={SplineType.CONSTANT_WALL}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.VARIABLE_WALL )}
                                    type={SplineType.VARIABLE_WALL}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.WOODEN_BRIDGE )}
                                    type={SplineType.WOODEN_BRIDGE}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.IRON_BRIDGE )}
                                    type={SplineType.IRON_BRIDGE}
                                />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='industries' style={{ zIndex: 20 }}>
                        <LayersControl.Overlay name="Industries" checked>
                            <LayerGroup>
                                {data.Industries.map( ( s, i ) => <Industry data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='sandhouses' style={{ zIndex: 30 }}>
                        <LayersControl.Overlay name="Sandhouses" checked>
                            <LayerGroup>
                                {data.Sandhouses.map( ( s, i ) => <Sandhouse data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='watertowers' style={{ zIndex: 40 }}>
                        <LayersControl.Overlay name="Watertowers" checked>
                            <LayerGroup>
                                {data.WaterTowers.map( ( s, i ) => <WaterTower data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='track' style={{ zIndex: 50 }}>
                        <LayersControl.Overlay name="Tracks" checked>
                            <LayerGroup>
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.TRACK )}
                                    type={SplineType.TRACK}
                                />
                                <Splines
                                    data={data.Splines.filter( ( s ) => s.Type === SplineType.TRENDLE_TRACK )}
                                    type={SplineType.TRENDLE_TRACK}
                                />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='turntables' style={{ zIndex: 60 }}>
                        <LayersControl.Overlay name="Turntables" checked>
                            <LayerGroup>
                                {data.Turntables.map( ( s, i ) => <Turntable data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='switches' style={{ zIndex: 70 }}>
                        <LayersControl.Overlay name="Switches" checked>
                            <LayerGroup>
                                {data.Switches.map( ( s, i ) => <Switch data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='frames' style={{ zIndex: 80 }}>
                        <LayersControl.Overlay name="Locomotives and Carts" checked>
                            <LayerGroup>
                                {data.Frames.map( ( s, i ) => <Frame data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='players' style={{ zIndex: 90 }}>
                        <LayersControl.Overlay name="Players" checked>
                            <LayerGroup>
                                {data.Players.map( ( s, i ) => <Player data={s} key={i} /> )}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </Pane>
                    <Pane name='popups' style={{ zIndex: 100 }} />
                </LayersControl>
            </MapContainer>
        </div>
    </MapContext.Provider>;

}

export * from './context';