import React from 'react';
import { MapProperties } from './interfaces';
import { Industry as IndustryData } from "../../../shared/data";

export const FirewoodDepot = React.memo( function( { data, map }: { data: IndustryData, map: MapProperties, index: number } ) {
    const { Location, Rotation } = data;
    const { imx, imy, minX, minY, scale } = map;

    const x = imx - ( ( Location[ 0 ] - minX ) / 100 * scale );
    const y = imy - ( ( Location[ 1 ] - minY ) / 100 * scale );

    return <path
        transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
        d={"M" + x + "," + y + " m-18,-15 l10,0 l0,30 l-10,0 z"}
        fill="orange"
        stroke="brown"
    />;
} );