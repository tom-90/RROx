import React, { useContext } from 'react';
import { ImageOverlay } from 'react-leaflet';

import { MapContext, MapMode } from './context';

const Backgrounds: { [ key: number ]: string } = {
    1: require( '../../../../assets/images/bg1.jpg' ),
    2: require( '../../../../assets/images/bg2.jpg' ),
    3: require( '../../../../assets/images/bg3.jpg' ),
    4: require( '../../../../assets/images/bg4.jpg' ),
    5: require( '../../../../assets/images/bg5.jpg' ),
};

export function Background() {
    const { map, settings, mode } = useContext( MapContext );

    return <ImageOverlay
        url={Backgrounds[ settings.background ]}
        bounds={map.bounds}
        opacity={mode === MapMode.MINIMAP && settings.transparent ? 0 : 1}
    />;
}