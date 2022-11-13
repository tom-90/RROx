import React, { useContext, useMemo } from 'react';
import { Curve, CurveProps } from '../leaflet';
import { SplineDefinitions } from '../definitions';
import { MapContext } from '../context';
import { ISplineTrack, SplineType } from '@rrox-plugins/world/shared';
import { CurvePathData } from '@elfalem/leaflet-curve';
import { useMemoCompare } from '../hooks';

function addLatLngs( a: [ lat: number, long: number ], b: [ lat: number, long: number ] ): [ lat: number, long: number ] {
    return [
        a[ 0 ] + b[ 0 ],
        a[ 1 ] + b[ 1 ],
    ]
}

function subLatLngs( a: [ lat: number, long: number ], b: [ lat: number, long: number ] ): [ lat: number, long: number ] {
    return [
        a[ 0 ] - b[ 0 ],
        a[ 1 ] - b[ 1 ],
    ]
}

function divLatLngs( a: [ lat: number, long: number ], b: [ lat: number, long: number ] ): [ lat: number, long: number ] {
    return [
        a[ 0 ] / b[ 0 ],
        a[ 1 ] / b[ 1 ],
    ]
}

export function SplineTracks( { data, type, ...curveProps }: { data: ISplineTrack[], type: SplineType } & Partial<CurveProps> ) {
    const { utils, preferences } = useContext( MapContext )!;

    const { path } = useMemoCompare( () => {
        const path: CurvePathData = [];

        data.forEach( ( spline ) => {
            const start = utils.scaleLocation( spline.location );
            const end = utils.scaleLocation( spline.locationEnd );
            const startTangent = utils.scaleLocation( spline.tangentStart );
            const endTangent = utils.scaleLocation( spline.tangentEnd );

            path.push(
                'M', start,
                'C', addLatLngs( start, divLatLngs( startTangent, [ 3, 3 ] ) ), subLatLngs( end, divLatLngs( endTangent, [ 3, 3 ] ) ), end
            );
        } );

        return { path, data };
    }, ( previous ) => {
        if( previous.data.length !== data.length )
            return false;
        return previous.data.every( ( item, i ) => data[ i ] === item );
    } );

    const definition = SplineDefinitions[ type ];

    if( path.length === 0 )
        return null;

    return <Curve
        path={path}
        color={preferences.colors.spline[ type ]}
        weight={definition.width}
        lineCap={'butt'}
        {...curveProps}
    />;
}