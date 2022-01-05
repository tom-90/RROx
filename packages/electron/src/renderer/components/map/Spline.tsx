import React from "react";
import { MapProperties } from './interfaces';
import { Spline as SplineData } from "@rrox/types";

const SplineDefinitions: { [ key: number ]: { width: number, color: string } } = {
    1: { width: 15, color: 'darkkhaki' }, // variable bank
    2: { width: 15, color: 'darkkhaki' }, // constant bank
    5: { width: 15, color: 'darkgrey'  }, // variable wall
    6: { width: 15, color: 'darkgrey'  }, // constant wall
    3: { width: 15, color: 'orange'    }, // wooden bridge
    7: { width: 15, color: 'lightblue' }, // iron bridge
    4: { width: 3 , color: 'black'     }, // trendle track
    0: { width: 3 , color: 'black'     }, // track
};

export function IsTrack( Type: number ) {
    return [ 4, 0 ].includes( Type );
}

export const Spline = React.memo( function( { data, map }: { data: SplineData, map: MapProperties, index: number } ) {
    const { Type, Segments } = data;
    const { imx, imy, minX, minY, scale } = map;
    const { width, color } = SplineDefinitions[ Type ];

    if( IsTrack( Type ) ) // If is track
        return <>{Segments.filter( ( s ) => s.Visible === true ).map( ( segment, i ) => <line
            key={i}
            x1={imx - ( ( segment[ 'LocationStart' ][ 0 ] - minX ) / 100 * scale )}
            y1={imy - ( ( segment[ 'LocationStart' ][ 1 ] - minY ) / 100 * scale )}
            x2={imx - ( ( segment[ 'LocationEnd' ][ 0 ] - minX ) / 100 * scale )}
            y2={imy - ( ( segment[ 'LocationEnd' ][ 1 ] - minY ) / 100 * scale )}
            stroke={color}
            strokeWidth={width}
        /> )}</>;

    let path = '';
    for ( const segment of Segments ) {
        let tool = 'L';
        if ( segment[ 'Visible' ] !== true )
            tool = 'M';

        let xStart = ( imx - ( ( segment[ 'LocationStart' ][ 0 ] - minX ) / 100 * scale ) );
        let yStart = ( imy - ( ( segment[ 'LocationStart' ][ 1 ] - minY ) / 100 * scale ) );
        let xEnd   = ( imx - ( ( segment[ 'LocationEnd' ][ 0 ] - minX ) / 100 * scale ) );
        let yEnd   = ( imy - ( ( segment[ 'LocationEnd' ][ 1 ] - minY ) / 100 * scale ) );

        if ( path === '' ) {
            path = 'M ' + xStart + ',' + yStart + ' ';
            path += tool + ' ' + xEnd + ',' + yEnd + ' ';
        } else {
            path += tool + ' ' + xEnd + ',' + yEnd + ' ';
        }
    }

    return <path
        d={path}
        fill={'none'}
        stroke={color}
        strokeWidth={width}
    />;
} );