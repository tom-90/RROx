import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayerGroup, LayersControl, MapContainer, Pane } from 'react-leaflet';
import L from 'leaflet';
import { MapContext, MapContextData, MapMode, MapSettings, MapActions, MapFeatures } from './context';
import { Line } from './leaflet/line';
import { Background } from './background';
import { Player as PlayerData, World } from '@rrox/types';
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
import { ContextMenu } from './leaflet/contextMenu';
import './styles.less';
import { usePrevious } from '../hooks/usePrevious';
import { Draw } from './draw/controls';
import { Paths } from './Paths';
import { SearchPopup } from "@rrox/components/src/mapLeaflet/popups/Search";
import { Modal } from './modal';

export function Map( { data, settings, actions, mode, features }: {
    data    : World,
    settings: MapSettings,
    actions : MapActions,
    mode    : MapMode,
    features: MapFeatures,
} ) {
    const location = useLocation();
    const navigate = useNavigate();

    const [ following, setFollowing ] = useState<{ array: keyof World, id: number, apply: ( data: any, map: L.Map ) => void } | null>( null );
    const [ map, setMap ] = useState<L.Map>();

    const [ drawSnapLayers, setDrawSnapLayers ] = useState<L.LayerGroup[]>( [] );
    const groundworkLayer = useRef<L.LayerGroup>();
    const trackLayer = useRef<L.LayerGroup>();
    const turntableLayer = useRef<L.LayerGroup>();
    const switchLayer = useRef<L.LayerGroup>();

    const [ searchVisible, setSearchVisible ] = useState(false);

    const followEnabled = mode !== MapMode.MAP;

    useEffect( () => {
        if( !map )
            return;

        const isFollowing = followEnabled && following?.array != null && following?.id != null && following.apply != null;

        if ( map.dragging.enabled() && isFollowing )
            map.dragging.disable();
        else if ( !map.dragging.enabled() && !isFollowing )
            map.dragging.enable();
        
        if ( map.options.scrollWheelZoom === true && isFollowing )
            map.options.scrollWheelZoom = 'center';
        else if ( map.options.scrollWheelZoom !== true && !isFollowing )
            map.options.scrollWheelZoom = true;

        if( isFollowing ) { 
            let item = data[ following?.array ]?.[ following?.id ];
            if( item )
                following.apply( item, map );
        }
    }, [ followEnabled, following?.array, following?.id, data[ following?.array ]?.[ following?.id ], map ] );

    const prevMode = usePrevious( mode );

    useEffect( () => {
        if( !map )
            return;

        const applyFollow = () => {
            if( followEnabled && following?.array != null && following?.id != null && following.apply != null ) {
                let item = data[ following?.array ]?.[ following?.id ];
                if( item )
                    following.apply( item, map );
            }
        };

        const observer = new ResizeObserver( () => {
            map.invalidateSize();

            applyFollow();
        } );

        observer.observe( map.getContainer() );

        applyFollow();

        if( prevMode === MapMode.MINIMAP && mode === MapMode.MAP ) {
            map.zoomIn( 1, { animate: false } );
        } else if( prevMode === MapMode.MAP && mode === MapMode.MINIMAP ) {
            map.zoomOut( 1, { animate: false } );
        }

        return () => observer.disconnect();
    }, [ map, mode, followEnabled, following?.array, following?.id, data[ following?.array ]?.[ following?.id ] ] );

    useEffect( () => {
        if( !location.state?.locate || !data || !map )
            return;
        
        const { type, id } = location.state.locate as { type: keyof World, id: number };
        const arr: { ID: number, Location?: [ number, number, number ] }[] = data[ type ];

        if( !arr )
            return;

        const item = arr.find( ( d ) => d.ID === id );
        
        if( !item || !item.Location )
            return;

        const anchor = utils.scalePoint( ...item.Location );
        map.setView( L.latLng( anchor[ 0 ], anchor[ 1 ] ), 14, { animate: false } );

        navigate( location.pathname );
    }, [ location.state, data, map ] );

    const mapProps = useMemo<MapContextData[ 'map' ]>( () => {
        // Game coordinate range
        const minX = -200000;
        const maxX = 200000;
        const minY = -200000;
        const maxY = 200000;

        // Calibrated against hi-res background
        const scale = 111300;

        return {
            bounds     : L.latLngBounds( L.latLng( minY / scale, minX / scale ), L.latLng( maxY / scale, maxX / scale ) ),
            center     : L.latLng( 0, 0 ),
            initialZoom: 12,
            minZoom    : 0,
            maxZoom    : 18,
            scale
        }
    }, [] );

    const utils = useMemo<MapContextData[ 'utils' ]>( () => {
        return {
            scalePoint : ( x: number, y: number ) => [ y / mapProps.scale, -1 * x / mapProps.scale ],
            scaleNumber: ( num: number ) => num / mapProps.scale,

            revertScalePoint: ( lat: number, lng: number ) => [ -1 * lng * mapProps.scale, lat * mapProps.scale ],

            rotate: (cx, cy, x, y, angle) => {
                let radians = ( Math.PI / 180 ) * -angle,
                    cos = Math.cos( radians ),
                    sin = Math.sin( radians ),
                    nx = ( cos * ( x - cx ) ) + ( sin * ( y - cy ) ) + cx,
                    ny = ( cos * ( y - cy ) ) - ( sin * ( x - cx ) ) + cy;
                return [ nx, ny ];
            },
        }
    }, [] );

    useEffect( () => {
        if( drawSnapLayers.length === 4 && groundworkLayer.current === drawSnapLayers[ 0 ] && trackLayer.current === drawSnapLayers[ 1 ] && turntableLayer.current === drawSnapLayers[ 2 ] && switchLayer.current === drawSnapLayers[ 3 ] )
            return;
        else if( groundworkLayer.current == null || trackLayer.current == null || turntableLayer.current == null || switchLayer.current == null )
            return drawSnapLayers.length > 0 && setDrawSnapLayers( [] );
        else
            setDrawSnapLayers( [ groundworkLayer.current, trackLayer.current, turntableLayer.current, switchLayer.current ] );
    }, [ groundworkLayer.current, trackLayer.current, turntableLayer.current, switchLayer.current ] );

    return <MapContext.Provider
            value={{
                settings,
                map: mapProps,
                actions,
                mode,
                utils,
                features,
                follow: {
                    array  : following?.array,
                    id     : following?.id,
                    enabled: followEnabled,

                setFollowing( array, id, apply ) {
                    if( array == null || id == null )
                        setFollowing( null );
                    else
                        setFollowing( { array, id, apply } );
                }
            }
        }}
    >
        <Modal>
            <div className={[ 'map', `map-${mode}`, `corner-${settings.minimapCorner}` ].join( ' ' )}>
                <MapContainer
                    center={mapProps.center}
                    bounds={mapProps.bounds}
                    zoom={mapProps.initialZoom}
                    zoomControl={false}
                    attributionControl={false}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                    whenCreated={( map ) => {
                        setMap( map );
                        if( mode !== MapMode.NORMAL )
                            setFollowing( {
                                array: 'Players',
                                id: data.Players.find( ( p ) => p.Name === actions.getSelectedPlayerName() )?.ID || 0,
                                apply: ( data: PlayerData, map: L.Map ) => {
                                    const anchor = utils.scalePoint( ...data.Location );
                                    map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
                                }
                            } );
                    }}
                >
                    <Controls
                        showFocusPlayer={data.Players.length > 0 ? ( following?.array != null && following?.id != null ? 2 : 1 ) : false}
                        onFocusPlayer={() => setFollowing(
                            following?.array != null && following?.id != null
                                    ? null
                                    : {
                                        array: 'Players',
                                        id: data.Players.find( ( p ) => p.Name === actions.getSelectedPlayerName() )?.ID || data.Players[ 0 ].ID,
                                        apply: ( data: PlayerData, map: L.Map ) => {
                                            const anchor = utils.scalePoint( ...data.Location );
                                            map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
                                        }
                                    }
                        )}
                        onSearchShow={() => {
                            setSearchVisible(true);
                        }}
                    />
                    {mode === MapMode.NORMAL && drawSnapLayers.length > 0 && features.build && <Draw snapLayers={drawSnapLayers} />}
                    <LayersControl>
                        <Pane name='background' style={{ zIndex: 0 }}>
                            <Line
                                positions={[
                                    mapProps.bounds.getNorthWest(),
                                    mapProps.bounds.getNorthEast(),
                                    mapProps.bounds.getSouthEast(),
                                    mapProps.bounds.getSouthWest(),
                                    mapProps.bounds.getNorthWest(),
                                ]}
                                color={'black'}
                                weight={1000}
                                opacity={mode === MapMode.MINIMAP && settings.transparent ? 0 : 1}
                            />
                            <Background />
                        </Pane>
                        <Pane name='groundwork' style={{ zIndex: 10 }}>
                            <LayersControl.Overlay name="Groundwork" checked>
                                <LayerGroup
                                    ref={groundworkLayer}
                                    eventHandlers={{ add: () => setDrawSnapLayers( [] ) }}
                                >
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
                                <LayerGroup ref={trackLayer}>
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
                                <LayerGroup ref={turntableLayer}>
                                    {data.Turntables.map( ( s, i ) => <Turntable data={s} key={i} /> )}
                                </LayerGroup>
                            </LayersControl.Overlay>
                        </Pane>
                        <Pane name='switches' style={{ zIndex: 70 }}>
                            <LayersControl.Overlay name="Switches" checked>
                                <LayerGroup ref={switchLayer}>
                                    {data.Switches.map( ( s, i ) => <Switch data={s} key={i} /> )}
                                </LayerGroup>
                            </LayersControl.Overlay>
                        </Pane>
                        <Pane name='frames' style={{ zIndex: 80 }}>
                            <LayersControl.Overlay name="Locomotives and Carts" checked>
                                <LayerGroup>
                                    {data.Frames.map( ( s, i ) => <Frame data={s} frames={data.Frames} key={i} /> )}
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
                        <Paths />
                    </LayersControl>
                    <ContextMenu />
                </MapContainer>
            </div>
        </Modal>
        <SearchPopup data={data} visible={searchVisible} setVisible={(visible) => setSearchVisible(visible)}/>
    </MapContext.Provider>;

}

export * from './context';

export * from './definitions/Frame';
export * from './definitions/Industry';
export * from './definitions/Product';
export * from './definitions/Sandhouse';
export * from './definitions/Spline';
export * from './definitions/Switch';
export * from './definitions/Turntable';
export * from './definitions/WaterTower';