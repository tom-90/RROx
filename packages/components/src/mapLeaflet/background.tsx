import React, { useContext } from 'react';
import { ImageOverlay } from 'react-leaflet';
import { TileLayer } from './leaflet/tileLayer';

import { MapContext, MapMode } from './context';

const Backgrounds: { [ key: number ]: string } = {
    1: require( '@rrox/assets/images/bg1.jpg' ),
    2: require( '@rrox/assets/images/bg2.jpg' ),
    3: require( '@rrox/assets/images/bg3.jpg' ),
    4: require( '@rrox/assets/images/bg4.jpg' ),
    5: require( '@rrox/assets/images/bg5.jpg' ),
    6: require( '@rrox/assets/images/bg6preview.jpg' ),
};

const context = require.context('@rrox/assets/images/bg6?file', true, /\.(webp)$/);
const Background6: { [ file: string ]: string } = {};

context.keys().forEach(( filename )=> Background6[ filename ] = context( filename ) );

export function Background() {
    const { map, settings, mode } = useContext( MapContext );

    if( settings.background === 6 )
        return <TileLayer
            getTileUrl={( { x, y, z } ) => Background6[ `./${z}/${x}/${y}.webp` ]}
            minNativeZoom={8}
            maxNativeZoom={12}
            maxZoom={undefined}
            minZoom={undefined}
            opacity={mode === MapMode.MINIMAP && settings.transparent ? 0 : 1}
            bounds={map.bounds}
        />;

    return <ImageOverlay
        url={Backgrounds[ settings.background ]}
        bounds={map.bounds}
        opacity={mode === MapMode.MINIMAP && settings.transparent ? 0 : 1}
    />;
}