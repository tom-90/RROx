import React from 'react';
import { MapProperties } from './interfaces';
import { Turntable as TurntableData } from "../../../shared/data";

export const Turntable = React.memo( function( { data, map }: { data: TurntableData, map: MapProperties, index: number } ) {
    const { Location, Rotation, Deck } = data;
    const { imx, imy, minX, minY, scale } = map;

    const radius = 25;

    const rotation = ( Rotation[ 1 ] + 90 ) * ( Math.PI / 180 );
    const rotation2 = ( Rotation[ 1 ] + 90 + Deck[ 1 ] ) * ( Math.PI / 180 );

    const x = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) );
    const y = ( imx - ( ( Location[ 1 ] - minX ) / 100 * scale ) );
    const x2 = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotation ) * radius ) );
    const y2 = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotation ) * radius ) );
    const cx = x + ( x2 - x ) / 2;
    const cy = y + ( y2 - y ) / 2;

    return <>
        <circle
            cx={cx}
            cy={cy}
            r={radius / 2}
            stroke="black"
            strokeWidth={1}
            fill="lightyellow"
        />
        <line
            x1={cx - ( Math.cos( rotation2 ) * radius / 2 )}
            y1={cy - ( Math.sin( rotation2 ) * radius / 2 )}
            x2={cx + ( Math.cos( rotation2 ) * radius / 2 )}
            y2={cy + ( Math.sin( rotation2 ) * radius / 2 )}
            stroke="black"
            strokeWidth={3}
        />
    </>;
} );