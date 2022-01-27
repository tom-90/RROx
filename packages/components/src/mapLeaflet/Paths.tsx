import React, {useContext} from 'react';
import { Line } from '@rrox/components/src/mapLeaflet/leaflet/line';
import { Circle } from '@rrox/components/src/mapLeaflet/leaflet/circle';
import { MapContext } from './context';

export const Paths = React.memo( function() {
    const { utils, actions } = useContext( MapContext );

    // @ts-expect-error
    if( !window.paths )
        return null;

    // @ts-expect-error
    let { vertices, edges } = window.paths;

    return <>
        {vertices.map( ( { location, color }: { location: [ number, number, number ], color: string }, i: number ) => {
            return <Circle key={'v' + i}
                           center={utils.scalePoint(...location)}
                           radius={30}
                           color={color}
                           weight={10}
                           fillColor={color} />
        } )}
        {edges.map( ( { a, b, color }: { a: { location: [ number, number, number ] }, b: { location: [ number, number, number ] }, color: string }, i: number ) => {
            let coordinates: [ number, number ][][] = [
                [
                    utils.scalePoint(...a.location),
                    utils.scalePoint(...b.location)
                ]
            ];

            return <Line
                key={'e' + i}
                positions={coordinates}
                color={color}
                weight={25}
            />;
        } )}
    </>;
} );