import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import '@elfalem/leaflet-curve';
import { CurvePathData } from '@elfalem/leaflet-curve';
import React, { ReactNode } from 'react';
import { useScalingWeight } from '../hooks';

export interface CurveProps extends L.CurveOptions {
    path: CurvePathData;
    children?: ReactNode;
}

const CurveComponent = createPathComponent<L.Curve, CurveProps>( function createCurve( options, context ) {
    const instance = new L.Curve( options.path, options );
    return {
        instance,
        context: { ...context, overlayContainer: instance },
    }
}, ( instance, props ) => {
    instance.setPath( props.path );
    instance.setStyle( props );
} );

export const Curve = React.memo( function Line( props: CurveProps ) {
    const { ref, weight } = useScalingWeight( props.weight );

    return <CurveComponent
        interactive={false}
        {...props}
        ref={ref}
        weight={weight}
    />;
} );