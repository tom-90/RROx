import React, { useContext } from 'react';
import { Turntable as TurntableData } from "@rrox/types";
import { MapContext } from '../context';
import { Line } from '../leaflet/line';
import { Circle } from '../leaflet/circle';
import { TurntableDefinitions } from '../definitions/Turntable';
import { SplineDefinitions } from '../definitions/Spline';
import L from 'leaflet';
import { SplineType } from '@rrox/types';
import { useScalingWeight } from '../hooks/useScalingWeight';

export const Turntable = React.memo( function Turntable( { data }: { data: TurntableData } ) {
    const { utils, actions } = useContext( MapContext );

    const { Location, Rotation, Deck } = data;

    let [ x1, y1 ] = Location;

    let [ x2, y2 ] = utils.rotate( x1, y1, x1 + TurntableDefinitions.radius * 2, y1, Rotation[ 1 ] - 90 );

    let cx = ( ( x1 + x2 ) / 2 );
    let cy = ( ( y1 + y2 ) / 2 );

    const trackDefinitions = SplineDefinitions[ SplineType.TRACK ];

    return <>
        <Circle
            center={utils.scalePoint( cx, cy )}
            edge={utils.scalePoint( x2, y2 )}
            fillColor={actions.getColor( 'turntable.circle' )}
            fillOpacity={1}
            color={'black'}
            weight={50}
            interactive={false}
        />
        <Line
            positions={[
                utils.scalePoint( ...utils.rotate( cx, cy, cx + TurntableDefinitions.radius, cy, Rotation[ 1 ] - 90 + Deck[ 1 ] ) ),
                utils.scalePoint( ...utils.rotate( cx, cy, cx - TurntableDefinitions.radius, cy, Rotation[ 1 ] - 90 + Deck[ 1 ] ) ),
            ]}
            color={actions.getColor( `spline.${SplineType.TRACK}` )}
            weight={trackDefinitions.width}
            lineCap={'butt'}
        />
    </>;
} );