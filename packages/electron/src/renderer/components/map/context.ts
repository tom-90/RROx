import { createContext } from "react";

export const MapContext = createContext<{
    followElement: ( type: 'player' | 'frame', index: number, element: SVGElement, data: any ) => void,
    stopFollowing: () => void,
    following: { type: 'player' | 'frame', index: number, element?: SVGElement, data?: any } | null,
    minimap: boolean,
    controlEnabled: boolean,
}>( {
    followElement: () => null,
    stopFollowing: () => null,
    following: null,
    minimap: false,
    controlEnabled: false,
} );