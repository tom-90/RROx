import React, { useContext } from 'react';
import { Line } from '../leaflet';
import { SplineDefinitions } from '../definitions';
import { SplineType } from '@rrox/types';
import { MapContext } from '../context';
import { useMemoCompare } from '../hooks';
import { ISpline } from '@rrox/world/shared';

export function Splines( { data, type }: { data: ISpline[], type: SplineType } ) {
    const { utils, preferences } = useContext( MapContext )!;

    const { coordinates } = useMemoCompare( () => {
        const coordinates: [ number, number ][][] = [];

        data.forEach( ( spline ) => {
            let segment: [ number, number ][] | null;

            spline.segments.forEach( ( s ) => {
                if ( !s.visible ) {
                    segment = null;
                    return;
                }

                if( !segment ) {
                    segment = [];
                    coordinates.push( segment );
                    segment.push( utils.scaleLocation( s.start ) );
                }

                segment.push( utils.scaleLocation( s.end ) );
            } );
        } );

        return {
            coordinates,
            data
        };
    }, ( previous ) => {
        if( previous.data.length !== data.length )
            return false;
        return previous.data.every( ( item, i ) => data[ i ] === item );
    } );

    const definition = SplineDefinitions[ type ];

    if( coordinates.length === 0 )
        return null;

    return <Line
        positions={coordinates}
        color={preferences[ `colors.spline.${type}` ]}
        weight={definition.width}
        lineCap={'butt'}
    />;
}