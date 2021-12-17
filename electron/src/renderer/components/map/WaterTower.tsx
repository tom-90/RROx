import React, { useContext, useState } from 'react';
import { MapProperties } from './interfaces';
import { WaterTower as WaterTowerData } from "../../../shared/data";
import { MapTooltip } from './Tooltip';
import { MapContext } from './context';
import { Button } from 'antd';
import { StorageInfo } from './StorageInfo';

export const WaterTower = React.memo( function( { data, map }: { data: WaterTowerData, map: MapProperties, index: number } ) {
    const { Location, Rotation, Storage } = data;
    const { imx, imy, minX, minY, scale } = map;

    const x = imx - ( ( Location[ 0 ] - minX ) / 100 * scale );
    const y = imy - ( ( Location[ 1 ] - minY ) / 100 * scale );

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const { minimap } = useContext( MapContext );

    return <MapTooltip
        title={'Watertower'}
        controls={<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <g className={'clickable highlight'}>
            <path
                transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
                d={"M" + x + "," + y + " m -5,-5 l10,0 l0,3 l3,0 l0,4 l-3,0 l0,3 l-10,0 z"}
                fill="lightblue"
                stroke="black"
                strokeWidth={1}
            />
            <circle
                cx={x}
                cy={y}
                r={3}
                fill="blue"
            />
        </g>
        <StorageInfo
            title={'Watertower'}
            storages={{
                'Water Level': [ Storage ],
            }}
            isVisible={infoVisible && !minimap}
            onClose={() => {
                setInfoVisible( false );
                setTooltipVisible( false );
            }}
        />
    </MapTooltip>;
} );