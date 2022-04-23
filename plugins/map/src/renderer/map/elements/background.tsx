import React, { useContext } from 'react';
import { ImageOverlay } from 'react-leaflet';
import { TileLayer } from '../leaflet';
import { MapContext } from '../context';
import { MapMode } from '../types';

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
    const { config, preferences, mode } = useContext( MapContext )!;

    if (preferences[ 'map.background' ] === 7) {
        document.body.setAttribute('data-map-theme', 'dark');
    }else{
        document.body.setAttribute('data-map-theme', 'light');
    }

    if( preferences[ 'map.background' ] === 6 || preferences[ 'map.background' ] === 7 )
        return <TileLayer
            getTileUrl={( { x, y, z } ) => Background6[ `./${z}/${x}/${y}.webp` ]}
            minNativeZoom={8}
            maxNativeZoom={12}
            maxZoom={undefined}
            minZoom={undefined}
            opacity={mode === MapMode.MINIMAP && preferences[ 'minimap.transparent' ] ? 0 : 1}
            bounds={config.map.bounds}
        />;

    return <ImageOverlay
        url={Backgrounds[ preferences[ 'map.background' ] ]}
        bounds={config.map.bounds}
        opacity={mode === MapMode.MINIMAP && preferences[ 'minimap.transparent' ] ? 0 : 1}
    />;
}