import React, { useContext } from 'react';
import { MapContext } from '../context';
import { Line } from '../leaflet';
import { SwitchDefinitions } from '../definitions';
import { Tooltip } from 'react-leaflet';
import { message } from 'antd';
import { ISwitch, SwitchType, ChangeSwitchCommunicator } from '@rrox/world/shared';
import { useRPC } from '@rrox/api';

export const Switch = React.memo( function Switch( { data, index }: { data: ISwitch, index: number } ) {
    const { utils, preferences, settings } = useContext( MapContext )!;

    const { type, location, rotation } = data;

    const changeSwitch = useRPC( ChangeSwitchCommunicator );

    if( type === SwitchType.CROSS ) {
        const definition = SwitchDefinitions[ SwitchType.CROSS ];
        
        let { X: px, Y: py } = location;

        let x1 = px + definition.length;
        let y1 = py;

        let [ end1x, end1y ] = utils.rotate( px, py, x1, y1, rotation.Yaw );

        let cx = ( ( px + end1x ) / 2 );
        let cy = ( ( py + end1y ) / 2 );

        let [ end2x, end2y ] = utils.rotate( cx, cy, px, py, -90 );
        let [ end3x, end3y ] = utils.rotate( cx, cy, px, py, 90 );

        return <Line
            positions={[
                [ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ],
                [ utils.scalePoint( end2x, end2y ), utils.scalePoint( end3x, end3y ) ],
            ]}
            color={preferences[ 'colors.switch.cross' ]}
            weight={definition.width}
            lineCap={'butt'}
        />;
    }

    const definition = SwitchDefinitions[ type ];

    let { X: px, Y: py } = location;
    let x1 = px - definition.length;
    let y1 = py;

    let [ end1x, end1y ] = utils.rotate( px, py, x1, y1, rotation.Yaw - 90 );
    let [ end2x, end2y ] = utils.rotate( px, py, x1, py, rotation.Yaw - 90 + definition.direction );

    let state = Boolean( data.state );

    if ( type === SwitchType.LEFT || type === SwitchType.LEFT_MIRROR )
        state = !state;

    const clickableLine = <Line
        color={preferences[ 'colors.switch.active' ]}
        weight={definition.width}
        positions={[ utils.scalePoint( end1x, end1y ), utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
        lineCap={'butt'}
        lineJoin={'bevel'}
        interactive={true}
        eventHandlers={{
            click: () => {
                if ( !settings[ 'features.controlSwitches' ] ) {
                    message.error( 'Flipping switches is disabled.' );
                    return;
                }
                changeSwitch( index );
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
                color={preferences[ 'colors.switch.inactive' ]}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ]}
                lineCap={'butt'}
            />
            <Line
                color={preferences[ 'colors.switch.active' ]}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
                lineCap={'butt'}
            />
        </>;
    else
        return <>
            {clickableLine}
            <Line
                color={preferences[ 'colors.switch.inactive' ]}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end2x, end2y ) ]}
                lineCap={'butt'}
            />
            <Line
                color={preferences[ 'colors.switch.active' ]}
                weight={definition.width}
                positions={[ utils.scalePoint( px, py ), utils.scalePoint( end1x, end1y ) ]}
                lineCap={'butt'}
            />
        </>;

} );