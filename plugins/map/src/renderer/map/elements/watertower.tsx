import React, { useContext, useState } from 'react';
import { MapContext } from '../context';
import { Shape, Circle, MapTooltip } from '../leaflet';
import { WaterTowerDefinitions } from '../definitions';
import { Button } from 'antd';
import { StorageInfo } from '../popups';
import { useAutoHide, usePopupElements } from './../hooks';
import { IWatertower, TeleportCommunicator } from '@rrox-plugins/world/shared';
import { MapMode } from '../types';
import { useRPC } from '@rrox/api';

export const WaterTower = React.memo( function WaterTower( { data, index }: { data: IWatertower, index: number } ) {
    const { utils, mode, settings, currentPlayerName } = useContext( MapContext )!;

    const { location, rotation, waterStorage } = data;

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const teleport = useRPC( TeleportCommunicator );

    let { X: cx, Y: cy } = location;
    let [ x2, y2 ] = utils.rotate( cx, cy, cx + WaterTowerDefinitions.size / 3, cy, rotation.Yaw );

    const popupElements = usePopupElements( { watertower: data, index } );

    // Fixes bug where watertowers appear too large when zoomed all the way out.
    if ( useAutoHide( utils.scalePoint( cx, cy ), utils.scalePoint( x2, y2 ) ) )
        return null;

    return <>
        <Shape
            positions={[
                utils.scalePoint( WaterTowerDefinitions.size / 2,  WaterTowerDefinitions.size / 2 ),
                utils.scalePoint( WaterTowerDefinitions.size / 2, -WaterTowerDefinitions.size / 2 ),
                utils.scalePoint( WaterTowerDefinitions.size / 5, -WaterTowerDefinitions.size / 2 ),
                utils.scalePoint( WaterTowerDefinitions.size / 5, -WaterTowerDefinitions.size / 2 - 100 ),
                utils.scalePoint( -WaterTowerDefinitions.size / 5, -WaterTowerDefinitions.size / 2 - 100 ),
                utils.scalePoint( -WaterTowerDefinitions.size / 5, -WaterTowerDefinitions.size / 2 ),
                utils.scalePoint( -WaterTowerDefinitions.size / 2, -WaterTowerDefinitions.size / 2 ),
                utils.scalePoint( -WaterTowerDefinitions.size / 2, WaterTowerDefinitions.size / 2 ),
            ]}
            anchor={utils.scaleLocation( location )}
            rotation={Math.round( rotation.Yaw ) - 90}
            color={'black'}
            fillColor={'lightblue'}
            fillOpacity={1}
            weight={60}
            interactive
        >
            <MapTooltip
                title={'Water Tower'}
                visible={tooltipVisible && mode !== MapMode.MINIMAP}
                setVisible={setTooltipVisible}
            >
                <Button onClick={() => {
                    setTooltipVisible( false );
                    setInfoVisible( true );
                }}>Show Info</Button>
                <StorageInfo
                    title={'Water Tower'}
					parentIndex={index}
                    storages={{
                        'Water Level': [ waterStorage ],
                    }}
                    className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
                    isVisible={infoVisible}
                    onClose={() => {
                        setInfoVisible( false );
                        setTooltipVisible( false );
                    }}
                />
                {popupElements}
            </MapTooltip>
        </Shape>
        <Circle
            center={utils.scaleLocation( location )}
            edge={utils.scalePoint( x2, y2 )}
            fillColor={'blue'}
            fillOpacity={1}
            color={'black'}
            interactive={false}
        />
    </>;
} );