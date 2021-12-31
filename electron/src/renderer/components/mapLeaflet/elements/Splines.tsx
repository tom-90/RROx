import React, { useContext } from 'react';
import { Spline as SplineData } from "../../../../shared/data";
import { Line } from '../leaflet/line';
import { SplineDefinitions } from '../definitions/Spline';
import { SplineType } from '../../../../shared/spline';
import { MapContext } from '../context';
import { useMemoCompare } from '../../../hooks/useMemoCompare';

export function Splines( { data, type }: { data: SplineData[], type: SplineType } ) {
    const { utils, actions } = useContext( MapContext );

    const { coordinates } = useMemoCompare( () => {
        const coordinates: [ number, number ][][] = [];

        data.forEach( ( spline ) => {
            let segment: [ number, number ][];

            spline.Segments.forEach( ( s ) => {
                if ( !s.Visible ) {
                    segment = null;
                    return;
                }

                if( !segment ) {
                    segment = [];
                    coordinates.push( segment );
                    segment.push( utils.scalePoint( ...s.LocationStart ) );
                }

                segment.push( utils.scalePoint( ...s.LocationEnd ) );
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

    return <Line
        positions={coordinates}
        color={actions.getColor( `spline.${type}` )}
        weight={definition.width}
        lineCap={'butt'}
    />;
}