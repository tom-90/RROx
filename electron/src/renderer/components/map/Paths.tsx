import React from 'react';
import { MapProperties } from './interfaces';

export const Paths = React.memo( function( { map }: { map: MapProperties } ) {
    const { scale, minX, minY, imx, imy } = map;

    // @ts-expect-error
    if( !window.paths )
        return null;

    // @ts-expect-error
    let { vertices, edges } = window.paths;

    return <>
        {vertices.map( ( { location, color }: { location: [ number, number, number ], color: string }, i: number ) => {
            const x = ( imx - ( ( location[ 0 ] - minX ) / 100 * scale ) );
            const y = ( imy - ( ( location[ 1 ] - minY ) / 100 * scale ) );

            return <circle id={'VERTEX' + i} key={'v' + i} cx={x} cy={y} r="1" stroke={color} strokeWidth="3" fill={color} />
        } )}
        {edges.map( ( { a, b, color }: { a: { location: [ number, number, number ] }, b: { location: [ number, number, number ] }, color: string }, i: number ) => {
            const xA = ( imx - ( ( a.location[ 0 ] - minX ) / 100 * scale ) );
            const yA = ( imy - ( ( a.location[ 1 ] - minY ) / 100 * scale ) );
            const xB = ( imx - ( ( b.location[ 0 ] - minX ) / 100 * scale ) );
            const yB = ( imy - ( ( b.location[ 1 ] - minY ) / 100 * scale ) );

            return <line
                x1={xA}
                y1={yA}
                x2={xB}
                y2={yB}
                stroke={color}
                strokeWidth={1}
            />;
        } )}
    </>;
} );