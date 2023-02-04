import React, { useContext, useMemo, useState } from 'react';
import { MapContext } from '../context';
import { IndustryDefinition, IndustryDefinitions, ProductDefinitions } from '../definitions';
import { Image, Shape, MapTooltip, Circle } from '../leaflet';
import { Button } from 'antd';
import { StorageInfo } from '../popups';
import { usePositions, usePopupElements } from '../hooks';
import { MapMode } from '../types';
import { ICrane, IIndustry, IStorage, storageUseCrane, TeleportCommunicator } from '@rrox-plugins/world/shared';
import { useRPC } from '@rrox/api';

export const Crane = React.memo( function Crane( { data, industry, storage, industryIndex, storageIndex }: { data: ICrane, industry: IIndustry, storage: IStorage, industryIndex: number, storageIndex: number } ) {
    const { utils, mode } = useContext( MapContext )!;
    
    const { location, rotation, id, type } = data;
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

	const useCrane = useRPC( storageUseCrane );

    const center = useMemo(() => {
        console.log(industry, storage, data);
        const storageLocation = utils.rotate(
            0,
            0,
            storage.location.X,
            storage.location.Y,
            industry.rotation.Yaw
        );
        const craneLocation = utils.rotate(
            0,
            0,
            location.X,
            location.Y,
            industry.rotation.Yaw + storage.rotation.Yaw
        );

        return {
            X: industry.location.X + storageLocation[0] + craneLocation[0],
            Y: industry.location.Y + storageLocation[1] + craneLocation[1],
            Z: industry.location.Z + storage.location.Z + location.Z,
        };
    }, [utils, location, rotation, industry, storage]);

    const product = ProductDefinitions[type];
    
    const tooltip = <MapTooltip
        title={`Crane ${id} - ${product?.name}`}
        visible={tooltipVisible && mode !== MapMode.MINIMAP}
        setVisible={setTooltipVisible}
    >
        <Button onClick={() => useCrane(industryIndex, storageIndex, id)}>Activate</Button>
    </MapTooltip>;

    return <Circle
        center={utils.scaleLocation( center )}
        radius={80}
        color={'black'}
        fillColor={'grey'}
        fillOpacity={1}
        weight={40}
        interactive
        className={`${industry.type}-${data.id}-${data.type}`}
    >{tooltip}</Circle>;
} );