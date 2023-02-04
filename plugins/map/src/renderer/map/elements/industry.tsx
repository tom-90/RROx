import React, { useContext, useMemo, useState } from 'react';
import { MapContext } from '../context';
import { IndustryDefinition, IndustryDefinitions } from '../definitions';
import { Image, Shape, MapTooltip } from '../leaflet';
import { Button } from 'antd';
import { StorageInfo } from '../popups';
import { usePositions, usePopupElements } from '../hooks';
import { MapMode } from '../types';
import { IIndustry, TeleportCommunicator } from '@rrox-plugins/world/shared';
import { useRPC } from '@rrox/api';
import { Crane } from './crane';

export const Industry = React.memo( function Industry( { data, index }: { data: IIndustry, index: number } ) {
    const { utils, mode } = useContext( MapContext )!;
    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    
    const { type, location, rotation, products, educts } = data;

    const definition = ( IndustryDefinitions[ type ] as IndustryDefinition | undefined ) ?? {
        name: 'Unknown',
        points: [ [ -500, 0 ], [ 500, 500 ] ],
        fillColor: '#666',
    };

    const popupElements = usePopupElements( { industry: data, index } );

    const tooltip = <MapTooltip
        title={definition.name}
        visible={tooltipVisible && mode !== MapMode.MINIMAP}
        setVisible={setTooltipVisible}
    >
        {(educts?.length > 0 || products?.length > 0) &&<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        <StorageInfo
            title={definition.name}
			parentIndex={index}
            storages={{
                Input: educts,
                Output: products
            }}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
            isVisible={infoVisible}
            height={500}
            onClose={() => {
                setInfoVisible( false );
                setTooltipVisible( false );
            }}
        />
        {popupElements}
    </MapTooltip>;

    const cranes = useMemo(() => {
        return [...data.products, ...data.educts].map((s, i) => s.cranes.map((crane) =>
            <Crane key={`${index}-${i}-${crane.id}`} data={crane} storage={s} industry={data} industryIndex={index} storageIndex={i} />
        )).flat();
    }, [data, index]);

    if ( !definition.image )
        return <>
            {cranes}
            <Shape
                positions={[
                    utils.scalePoint( definition.points[ 0 ][ 0 ], definition.points[ 0 ][ 1 ] ),
                    utils.scalePoint( definition.points[ 0 ][ 0 ], definition.points[ 1 ][ 1 ] ),
                    utils.scalePoint( definition.points[ 1 ][ 0 ], definition.points[ 1 ][ 1 ] ),
                    utils.scalePoint( definition.points[ 1 ][ 0 ], definition.points[ 0 ][ 1 ] ),
                ]}
                anchor={utils.scaleLocation( location )}
                rotation={Math.round( rotation.Yaw ) - 90}
                color={'black'}
                fillColor={definition.fillColor || 'grey'}
                fillOpacity={1}
                weight={60}
                interactive
            >{tooltip}</Shape>
        </>;

    const anchor = utils.scaleLocation( location );

    const [
        topLeft,
        topRight,
        bottomLeft
    ]: [ [ number, number ], [ number, number ], [ number, number ] ] = usePositions( [
        utils.scalePoint( ...definition.points[ 0 ] ),
        utils.scalePoint( ...definition.points[ 1 ] ),
        utils.scalePoint( ...definition.points[ 2 ]! ),
    ], anchor, rotation.Yaw );

    /*const { points, markers } = useImageAdjust( [
        utils.scalePoint( ...definition.points[ 0 ] ),
        utils.scalePoint( ...definition.points[ 1 ] ),
        utils.scalePoint( ...definition.points[ 2 ] ),
    ], anchor, Rotation[ 1 ] );

    const [
        topLeft,
        topRight,
        bottomLeft
    ]: [ [ number, number ], [ number, number ], [ number, number ] ] = points;*/

    return <>
        {cranes}
        <Image
            topLeft={topLeft}
            topRight={topRight}
            bottomLeft={bottomLeft}
            url={definition.image}
            interactive
        >
            {tooltip}
        </Image>
    </>;
} );