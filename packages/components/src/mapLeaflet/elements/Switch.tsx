import React, { useContext } from 'react';
import { Switch as SwitchData } from "@rrox/types";
import { SwitchType } from '@rrox/types';
import { MapContext } from '../context';
import { Line } from '../leaflet/line';
import { SwitchDefinitions } from '../definitions/Switch';
import { Tooltip } from 'react-leaflet';

export const Switch = React.memo( function Switch( { data }: { data: SwitchData } ) {
    const { utils, controlEnabled, actions } = useContext( MapContext );

    const { ID, Type, Side, Location, Rotation } = data;

    if( Type === SwitchType.CROSS ) {
        const definition = SwitchDefinitions[ SwitchType.CROSS ];
        
        let [ px, py ] = Location;

        let x1 = px + definition.length;
        let y1 = py;

        let [ end1x, end1y ] = utils.rotate( px, py, x1, y1, Rotation[ 1 ] );

        let cx = ( ( px + end1x ) / 2 );
        let cy = ( ( py + end1y ) / 2 );

        let [ end2x, end2y ] = utils.rotate( cx, cy, px, py, -90 );
        let [ end3x, end3y ] = utils.rotate( cx, cy, px, py, 90 );

        return <Line
            positions={[
                [ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ],
                [ utils.scalePoint( end2x, end2y ), utils.scalePoint( end3x, end3y ) ],
            ]}
            color={actions.getColor( 'switch.cross' )}
            weight={definition.width}
            lineCap={'butt'}
        />;
    }

    const definition = SwitchDefinitions[ Type ];

    let [ px, py ] = Location;
    let x1 = px - definition.length;
    let y1 = py;

    let [ end1x, end1y ] = utils.rotate( px, py, x1, y1, Rotation[ 1 ] - 90 );
    let [ end2x, end2y ] = utils.rotate( px, py, x1, py, Rotation[ 1 ] - 90 + definition.direction );

    let state = Boolean( Side );

    if ( Type === SwitchType.LEFT || Type === SwitchType.LEFT_MIRROR )
        state = !state;

    const clickableLine = <Line
        color={actions.getColor( 'switch.active' )}
        weight={definition.width}
        positions={[ utils.scalePoint( end1x, end1y ), utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
        lineCap={'butt'}
        lineJoin={'bevel'}
        interactive={controlEnabled}
        eventHandlers={{
            click: () => {
                if ( !controlEnabled )
                    return;
                actions.changeSwitch( ID );
            }
        }}
    >
        <Tooltip pane='popups' >
            Flip Switch
        </Tooltip>
    </Line>;

    if( state )
        return <>
            {clickableLine}
            <Line
                color={actions.getColor( 'switch.inactive' )}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ]}
                lineCap={'butt'}
            />
            <Line
                color={actions.getColor( 'switch.active' )}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
                lineCap={'butt'}
            />
        </>;
    else
        return <>
            {clickableLine}
            <Line
                color={actions.getColor( 'switch.inactive' )}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
                lineCap={'butt'}
            />
            <Line
                color={actions.getColor( 'switch.active' )}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ]}
                lineCap={'butt'}
            />
        </>;

} );