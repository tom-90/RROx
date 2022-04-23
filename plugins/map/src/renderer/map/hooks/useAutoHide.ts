import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

export const useAutoHide = ( point1: [ number, number ], point2: [ number, number ], threshold: number = 0 ): any => {
    const [ hidden, setHidden ] = useState( false );

    const map = useMapEvents( {
        zoomend: () => {
            let pixelDistance = map.latLngToContainerPoint( point1 ).distanceTo( map.latLngToContainerPoint( point2 ) );
            setHidden( pixelDistance <= threshold );
        },
    } );

    return hidden;
};