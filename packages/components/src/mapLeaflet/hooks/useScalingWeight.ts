import { useMemo, useRef } from 'react';
import L, { Path } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

export function useScalingWeight( weight: number ) {
    const ref = useRef();

    const map = useMapEvents( {
        zoomend: () => { ( ref.current as Path )?.setStyle( { weight: calculateWeight( weight ) } ); }
    } );

    const calculateWeight = ( weight: number ) => {
        let centerLatLng = map.getCenter();
        let centerPoint  = map.latLngToContainerPoint( centerLatLng );
        let latLngX      = map.containerPointToLatLng( L.point( centerPoint.x + 10, centerPoint.y ) );

        return weight * 0.5 / ( centerLatLng.distanceTo( latLngX ) / 10 );
    };

    const calculatedWeight = useMemo( () => calculateWeight( weight ), [] );

    return { ref, weight: calculatedWeight };
}