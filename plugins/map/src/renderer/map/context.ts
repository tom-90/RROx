import { createContext } from "react";
import L from 'leaflet';
import { ILocation, IWorldSettings } from "@rrox-plugins/world/shared";
import { MapMode } from "./types";
import { FollowingData } from "./hooks";
import { IMapPreferences } from "../../shared";

export interface MapContextData {
    follow: {
        following?: FollowingData,
        setFollowing: ( following?: FollowingData ) => void,
    },

    currentPlayerName: string;

    settings: IWorldSettings,
    preferences: IMapPreferences,

    mode: MapMode;

    config: {
        game: {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        };
        map: {
            scale: number;
            bounds: L.LatLngBounds;
            center: L.LatLng;
            initialZoom: number;
            minZoom: number;
            maxZoom: number;
        };
    }

    utils: {
        scalePoint: (x: number, y: number) => [lat: number, long: number];
        scaleLocation: (location: ILocation) => [lat: number, long: number];
        scaleNumber: (num: number) => number;
        revertScalePoint: (lat: number, lng: number) => [ x: number, y: number ];
        rotate: (cx: number, cy: number, x: number, y: number, angle: number) => [ x: number, y: number ];
    };
}

export const MapContext = createContext<MapContextData | undefined>( undefined );