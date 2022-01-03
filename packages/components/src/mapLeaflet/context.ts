import { createContext } from "react";
import L from 'leaflet';
import { World } from "@rrox/types";
import { EngineControls } from "@rrox/types";

export interface MapSettings {
    background   : number;
    minimapCorner: number;
    transparent  : boolean;
}

export interface MapActions {
    teleport         : ( x: number, y: number, z: number ) => void;
    changeSwitch     : ( id: number ) => void;
    setEngineControls: ( id: number, type: EngineControls, value: number ) => void;
    getColor         : ( key: string ) => string;
}

export interface MapContextData {
    settings: MapSettings,
    actions: MapActions,
    map: {
        bounds     : L.LatLngBounds;
        center     : L.LatLng;
        minZoom    : number;
        maxZoom    : number;
        initialZoom: number;
        scale      : number;
    },
    utils: {
        scalePoint ( x: number, y: number, z?: number ): [ lat: number, long: number ];
        scaleNumber( num: number ): number;
        
        revertScalePoint( lat: number, long: number ): [ x: number, y: number ];

        rotate( cx: number, cy: number, x: number, y: number, angle: number ): [ x: number, y: number ];
    },
    follow: {
        array?: keyof World,
        id?: number;
        enabled: boolean;
        setFollowing( array?: keyof World, id?: number ): void;
    },
    controlEnabled: boolean,
    mode: MapMode;
}

export enum MapMode {
    // Normal mode, when showing map in desktop app
    NORMAL = 'normal',

    // Large map in-game after pressing F1
    MAP = 'map',

    // In-game minimap
    MINIMAP = 'minimap',
}

export const MapContext = createContext<MapContextData>( null );