import React, { useContext, useState } from 'react';
import { MapProperties } from './interfaces';
import { Sandhouse as SandhouseData } from "../../../shared/data";
import { MapTooltip } from './Tooltip';
import { MapContext } from './context';
import { Button } from 'antd';
import { StorageInfo } from './StorageInfo';
import SandhouseImage from '../../../../assets/images/Sandhouse.svg';

export const Sandhouse = React.memo( function( { data, map }: { data: SandhouseData, map: MapProperties, index: number } ) {
    const { Location, Rotation, Storage } = data;
    const { imx, imy, minX, minY, scale } = map;

    const x = imx - ( ( Location[ 0 ] - minX ) / 100 * scale );
    const y = imy - ( ( Location[ 1 ] - minY ) / 100 * scale );

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const { minimap } = useContext( MapContext );

    return <MapTooltip
        title={'Sandhouse'}
        controls={<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <image
            xlinkHref={SandhouseImage}
            transform={`rotate(${Math.round( Rotation[ 1 ] ) - 90}, ${x}, ${y}) translate(${x - 10},${y - 20})`}
            width={25}
            height={25}
            className={'clickable highlight'}
        />
        <StorageInfo
            title={'Sandhouse'}
            storages={{
                'Sand Level': [ Storage ],
            }}
            className={minimap ? 'modal-hidden' : undefined}
            isVisible={infoVisible}
            onClose={() => {
                setInfoVisible( false );
                setTooltipVisible( false );
            }}
        />
    </MapTooltip>;
} );