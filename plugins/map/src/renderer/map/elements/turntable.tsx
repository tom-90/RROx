import React, { useContext } from 'react';
import { MapContext } from '../context';
import { Line, Circle } from '../leaflet';
import { TurntableDefinitions, SplineDefinitions } from '../definitions';
import { ITurntable, SplineType } from '@rrox/world/shared';

export const Turntable = React.memo( function Turntable( { data }: { data: ITurntable } ) {
    const { utils, preferences } = useContext( MapContext )!;

    const { location, rotation, deckRotation } = data;

    let { X: x1, Y: y1 } = location;
    let [ x2, y2 ] = utils.rotate( x1, y1, x1 + TurntableDefinitions.radius * 2, y1, rotation.Yaw - 90 );

    let cx = ( ( x1 + x2 ) / 2 );
    let cy = ( ( y1 + y2 ) / 2 );

    const trackDefinitions = SplineDefinitions[ SplineType.TRACK ];

    return <>
        <Circle
            center={utils.scalePoint( cx, cy )}
            edge={utils.scalePoint( x2, y2 )}
            fillColor={preferences[ 'colors.turntable.circle' ]}
            fillOpacity={1}
            color={'black'}
            weight={50}
            interactive={false}
        />
        <Line
            positions={[
                utils.scalePoint( ...utils.rotate( cx, cy, cx + TurntableDefinitions.radius, cy, rotation.Yaw - 90 + deckRotation.Yaw ) ),
                utils.scalePoint( ...utils.rotate( cx, cy, cx - TurntableDefinitions.radius, cy, rotation.Yaw - 90 + deckRotation.Yaw ) ),
            ]}
            color={preferences[ `colors.spline.${SplineType.TRACK}` ]}
            weight={trackDefinitions.width}
            lineCap={'butt'}
        />
    </>;
} );