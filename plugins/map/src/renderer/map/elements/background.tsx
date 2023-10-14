import React, { useContext, useEffect, useRef } from 'react';
import { ImageOverlay } from 'react-leaflet';
import { TileLayer } from '../leaflet';
import { MapContext } from '../context';
import { MapMode } from '../types';

const Backgrounds: { [ key: number ]: string } = {
    1: require( '../../images/bg1.jpg' ),
    2: require( '../../images/bg2.jpg' ),
    3: require( '../../images/bg3.jpg' ),
    4: require( '../../images/bg4.jpg' ),
    5: require( '../../images/bg5.jpg' ),
    6: require( '../../images/bg6preview.jpg' ),
    8: require( '../../images/bg8.jpg' ),
    9: require( '../../images/bg9.jpg' ),
    10: require( '../../images/bg10.jpg' ),
    11: require( '../../images/bg6preview.jpg' ),
};

const Background6: { [ file: string ]: string } = {};
const bg6context = require.context( '../../images/bg6?file', true, /\.(webp)$/ )
bg6context.keys().forEach( ( filename ) => Background6[ filename ] = bg6context( filename ) );

const Background11: { [ file: string ]: string } = {};
const bg11context = require.context( '../../images/bg11?file', true, /\.(png)$/ )
bg11context.keys().forEach( ( filename ) => Background11[ filename ] = bg11context( filename ) );

export function Background() {
    const { config, preferences, mode } = useContext( MapContext )!;

    if ( preferences.map.background === 6 || preferences.map.background === 7 )
        return <TileLayer
            getTileUrl={( { x, y, z } ) => Background6[ `./${z}/${x}/${y}.webp` ]}
            minNativeZoom={8}
            maxNativeZoom={12}
            maxZoom={undefined}
            minZoom={undefined}
            opacity={mode === MapMode.MINIMAP && preferences.minimap.transparent ? 0 : 1}
            bounds={config.map.bounds}
            key={preferences.map.background}
            className={preferences.map.background === 7 ? 'background-dark' : undefined}
        />;

    if ( preferences.map.background === 11 || preferences.map.background === 12 )
        return <TileLayer
            getTileUrl={( { x, y, z } ) => Background11[ `./${z}/${x}/${y}.png` ]}
            minNativeZoom={8}
            maxNativeZoom={12}
            maxZoom={undefined}
            minZoom={undefined}
            opacity={mode === MapMode.MINIMAP && preferences.minimap.transparent ? 0 : 1}
            bounds={config.map.bounds}
            key={preferences.map.background}
            className={preferences.map.background === 12 ? 'background-dark' : undefined}
        />;

    return <ImageOverlay
        url={Backgrounds[ preferences.map.background ]}
        bounds={config.map.bounds}
        opacity={mode === MapMode.MINIMAP && preferences.minimap.transparent ? 0 : 1}
    />;
}