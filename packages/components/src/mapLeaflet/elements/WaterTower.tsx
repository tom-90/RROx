import React, { useContext, useState } from 'react';
import { WaterTower as WaterTowerData } from "@rrox/types";
import { MapContext, MapMode } from '../context';
import L from 'leaflet';
import { Shape } from '../leaflet/shape';
import { Circle } from '../leaflet/circle';
import { WaterTowerDefinitions } from '../definitions/WaterTower';
import { MapTooltip } from '../leaflet/tooltip';
import { Button } from 'antd';
import { StorageInfo } from '../popups/StorageInfo';
import { useScalingWeight } from '../hooks/useScalingWeight';
import { useMapEvents } from 'react-leaflet';
import { useAutoHide } from './../hooks/useAutoHide';

export const WaterTower = React.memo( function WaterTower( { data }: { data: WaterTowerData } ) {
    const { utils, mode, actions } = useContext( MapContext );

    const { Location, Rotation, Storage } = data;

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    let [ cx, cy ] = Location;
    let [ x2, y2 ] = utils.rotate( cx, cy, cx + WaterTowerDefinitions.size / 3, cy, Rotation[ 1 ] );

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
            anchor={utils.scalePoint( ...Location )}
            rotation={Math.round( Rotation[ 1 ] ) - 90}
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
                <Button
                    style={{ marginTop: 5 }}
                    onClick={() => actions.teleport( data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] + 1000 )}
                >Teleport Here</Button>
                <StorageInfo
                    title={'Water Tower'}
                    storages={{
                        'Water Level': [ Storage ],
                    }}
                    className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
                    isVisible={infoVisible}
                    onClose={() => {
                        setInfoVisible( false );
                        setTooltipVisible( false );
                    }}
                />
            </MapTooltip>
        </Shape>
        <Circle
            center={utils.scalePoint( ...Location )}
            edge={utils.scalePoint( x2, y2 )}
            fillColor={'blue'}
            fillOpacity={1}
            color={'black'}
            interactive={false}
        />
    </>;
} );