import React, { useMemo } from 'react';
import L from 'leaflet';
import { Circle as LeafletCircle } from 'react-leaflet';
import { useScalingWeight } from '../hooks';

export const Circle = React.memo( function Circle( props: React.ComponentProps<typeof LeafletCircle> & {
    center : [ number, number ],
    edge  ?: [ number, number ],
    weight?: number,
} ) {
    let { weight, edge, center, ...restProps } = props;

    const { ref, weight: calculatedWeight } = useScalingWeight( weight || 0 );

    const distance = useMemo( () => edge ? L.latLng( center ).distanceTo( L.latLng( edge ) ) : 0, [ ...(edge || []), ...center ] );

    return <LeafletCircle
        interactive={false}
        center={center}
        radius={distance}
        {...restProps}
        pathOptions={{
            ...( props.pathOptions || {} ),
            color: props.color,
            fillColor: props.fillColor,
        }}
        weight={calculatedWeight}
        ref={ref}
    />;
} );