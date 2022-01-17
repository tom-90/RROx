import { BuildSplinePoints, SplineType } from '@rrox/types';
import L from 'leaflet';
import { MapActions, MapContextData } from '../..';
import { PathToolbar } from './toolbar';
import { PathCoordinates } from './utils';

export interface PathOptions extends L.DrawOptions.PolylineOptions {
    addNew?: boolean;
    edit?: boolean;
    addInBetween?: boolean;
    snapLayers?: L.Layer[];
    modeControl?: any;
    actions?: MapActions;
    utils?: MapContextData[ 'utils' ];
}

export declare class Path extends L.Draw.Feature {
    constructor( map: L.DrawMap, options?: PathOptions );
    type: 'path';
    _tooltip: L.Draw.Tooltip;
    _map: L.DrawMap;
    options: PathOptions;

    markers: Marker[];
    markerGroup: L.LayerGroup;

    path: L.Curve;

    guide: Guide;
    toolbar: PathToolbar;

    mouseHandler: MouseHandler;
    
    snapper: any;
    snapEnabled: boolean;

    pointMarker?: L.CircleMarker;

    updateTooltip( latLng: L.LatLng ): void;
    updateGuide( point: L.Point ): void;

    updateMousePosition( point: L.Point, latLng: L.LatLng ): void;

    addVertex( latLng: L.LatLng ): void;
    
    getMarker( latlng: [ number, number ] ): Marker;
    addMarker( ...latLngs: [ number, number ][] ): void;
    removeMarker( latlng: [ number, number ] ): void;

    toggleNewPoint(): void;
    toggleSnap(): void;

    onZoom(): void;
    onTypeSelect(): void;

    showPoint( e: { distance: number, totalDistance: number } ): void;

    setPathStyle( path?: L.Curve ): void;

    usePath( path: L.Curve ): void;

    setSnap( snap: boolean ): void;

    on( ...params: any[] ): void;
    off( ...params: any[] ): void;
}

export interface MouseHandlerOptions extends L.MarkerOptions {
    snapLayers?: L.Layer[];
}

export declare class MouseHandler extends L.Marker {
    constructor( latLng: L.LatLng, path: Path, map: L.DrawMap, options?: MouseHandlerOptions );

    options: MouseHandlerOptions;

    path: Path;
    map: L.DrawMap;

    mouseIcon: L.Icon | L.DivIcon;
    snapIcon: L.Icon | L.DivIcon;

    mouseDownPosition?: L.Point;

    _onMouseOut ( e: L.LeafletMouseEvent ): void;
    _onMouseMove( e: L.LeafletMouseEvent ): void;
    _onMouseDown( e: L.LeafletMouseEvent ): void;
    _onMouseUp  ( e: L.LeafletMouseEvent ): void;

    _onSnap(): void;
    _onUnsnap(): void;
}

export interface GuideOptions {
    segmentLength: number,
    maxLength: number,
    color: string,
}

export declare class Guide extends L.Layer {
    constructor( options?: GuideOptions );

    options: GuideOptions;

    container: HTMLDivElement;

    clear(): void;
    draw( from: L.Point, to: L.Point ): void;
}

export interface MarkerOptions extends L.MarkerOptions {
    touchIcon?: L.Icon | L.DivIcon | undefined;
}

export declare class Marker extends L.Marker {
    constructor( coordinates: PathCoordinates, path: Path, options?: MarkerOptions );

    isControlPoint: boolean;

    options: MarkerOptions;

    path: Path;

    guide: Guide;

    coordinates: PathCoordinates;

    onConvertMarker(): void;
    onDrag(): void;

    isCurved(): boolean;
    updateCurveMarkers(): void;

    updatePath( latLng?: [ number, number ], nested?: boolean ): void;
    updateGuide(): void;
}

declare module 'leaflet' {
    namespace Draw {
        interface Tooltip {
            _onMouseOut( e: LeafletMouseEvent ): void;
        }
    }
    interface Curve {
        getPath(): ( string | number[] )[];
        setPath( data: ( string | number[] )[] ): Curve;

        pointData?: BuildSplinePoints;
        splineType?: SplineType;
    }
}

export type ClassConstructor<S, T> = S & { new( ...args: any[] ): T }; 