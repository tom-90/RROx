import { ILocation } from "@rrox/world/shared";
import L from "leaflet";

const GameOptions = {
    minX: -200000,
    maxX: 200000,
    minY: -200000,
    maxY: 200000,
}

const scale = 111300;
const MapOptions = {
    scale,
    bounds: L.latLngBounds( L.latLng( GameOptions.minY / scale, GameOptions.minX / scale ), L.latLng( GameOptions.maxY / scale, GameOptions.maxX / scale ) ),
    center: L.latLng( 0, 0 ),
    initialZoom: 12,
    minZoom: 0,
    maxZoom: 18,
};

const Utils = {
    scalePoint   : ( x: number, y: number ): [ Y: number, X: number ] => [ y / scale, -1 * x / scale ],
    scaleLocation: ( location: ILocation ): [ Y: number, X: number ] => [ location.Y / scale, -1 * location.X / scale ],
    scaleNumber  : ( num: number ) => num / scale,

    revertScalePoint: ( lat: number, lng: number ): [ number, number ] => [ -1 * lng * scale, lat * scale ],

    rotate: ( cx: number, cy: number, x: number, y: number, angle: number ): [ number, number ] => {
        let radians = ( Math.PI / 180 ) * -angle,
            cos = Math.cos( radians ),
            sin = Math.sin( radians ),
            nx = ( cos * ( x - cx ) ) + ( sin * ( y - cy ) ) + cx,
            ny = ( cos * ( y - cy ) ) - ( sin * ( x - cx ) ) + cy;
        return [ nx, ny ];
    },
};

export const MapConfig = {
    game: GameOptions,
    map: MapOptions,
    utils: Utils,
}