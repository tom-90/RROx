import React, { useContext, useState } from 'react';
import { MapProperties } from './interfaces';
import { Switch as SwitchData } from "../../../shared/data";
import { Tooltip } from 'antd';
import { MapContext } from './context';

export const Switch = React.memo( function( { data, map }: { data: SwitchData, map: MapProperties, index: number } ) {
    const { controlEnabled } = useContext( MapContext );

    const { Type, Side, Location, Rotation, ID } = data;
    const { scale, minX, minY, imx, imy } = map;

    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const radius = 80;

    let direction = 0;
    let state = Boolean( Side );

    /**
     * 0 = SwitchLeft           = lever left switch going left
     * 1 = SwitchRight          = lever right switch going right
     * 2 =                      = Y
     * 3 =                      = Y mirror
     * 4 = SwitchRightMirror    = lever left switch going right
     * 5 = SwitchLeftMirror     = lever right switch going left
     * 6 = SwitchCross90        = cross
     */
    switch ( Type ) {
        case 0:
            direction = -6;
            state = !state;
            break;
        case 1:
        case 3:
        case 4:
            direction = 6;
            break;
        case 2:
            direction = -6;
            break;
        case 5:
            state = !state;
            direction = -6;
            break;
        case 6:
            direction = 99;
            break;
        default:
            direction = 1;
    }

    const rotation = ( Rotation[ 1 ] - 90 ) * ( Math.PI / 180 );
    const rotSide = ( Rotation[ 1 ] - 90 + direction ) * ( Math.PI / 180 );
    const rotCross = ( Rotation[ 1 ] + 180 ) * ( Math.PI / 180 );

    const x = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) );
    const y = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) );

    //Cross
    if( direction === 99 ) {
        const crosslength = radius / 10;
        const x2 = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotCross ) * crosslength ) );
        const y2 = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotCross ) * crosslength ) );
        const cx = x + ( x2 - x ) / 2;
        const cy = y + ( y2 - y ) / 2;
        return <>
            <line
                x1={x}
                y1={y}
                x2={x2}
                y2={y2}
                stroke="black"
                strokeWidth={3}
            />
            <line
                x1={( cx - ( Math.cos( rotation ) * crosslength ) )}
                y1={( cy - ( Math.sin( rotation ) * crosslength ) )}
                x2={( cx + ( Math.cos( rotation ) * crosslength ) )}
                y2={( cy + ( Math.sin( rotation ) * crosslength ) )}
                stroke="black"
                strokeWidth={3}
            />
        </>;
    }    

    return <Tooltip
        title="Flip Switch"
        visible={tooltipVisible && controlEnabled}
        onVisibleChange={setTooltipVisible}
    >
        <g
            className={controlEnabled ? `clickable highlight` : undefined}
            onClick={() => {
                if( !controlEnabled )
                    return;
                window.ipc.send( 'change-switch', ID );
                setTooltipVisible( false );
            }}
        >
            {state ? <>
                <line
                    x1={x}
                    y1={y}
                    x2={imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotation ) * radius / 2 )}
                    y2={imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotation ) * radius / 2 )}
                    stroke={"red"}
                    strokeWidth={3}
                />
                <line
                    x1={x}
                    y1={y}
                    x2={imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotSide ) * radius / 2 )}
                    y2={imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotSide ) * radius / 2 )}
                    stroke={"black"}
                    strokeWidth={3}
                />
            </> : <>
                <line
                    x1={x}
                    y1={y}
                    x2={imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotSide ) * radius / 2 )}
                    y2={imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotSide ) * radius / 2 )}
                    stroke={"red"}
                    strokeWidth={3}
                />
                <line
                    x1={x}
                    y1={y}
                    x2={imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) + ( Math.cos( rotation ) * radius / 2 )}
                    y2={imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) + ( Math.sin( rotation ) * radius / 2 )}
                    stroke={"black"}
                    strokeWidth={3}
                />
            </>}
        </g>
    </Tooltip>;
} );