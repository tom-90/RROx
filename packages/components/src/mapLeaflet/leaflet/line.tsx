import React, { useState, useMemo, useRef } from 'react';
import L, { Polyline as LeafletPolyline } from 'leaflet';
import { Polyline, useMapEvents } from 'react-leaflet';
import { useScalingWeight } from '../hooks/useScalingWeight';

export const Line = React.memo( function Line( props: React.ComponentProps<typeof Polyline> ) {
    const { ref, weight } = useScalingWeight( props.weight );

    return <Polyline
        interactive={false}
        {...props}
        ref={ref}
        weight={weight}
    />;
} );