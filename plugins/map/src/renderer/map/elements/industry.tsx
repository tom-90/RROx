import React, { useContext, useState } from 'react';
import { MapContext } from '../context';
import { IndustryDefinitions } from '../definitions';
import { Image, Shape, MapTooltip } from '../leaflet';
import { Button } from 'antd';
import { StorageInfo } from '../popups';
import { usePositions, useImageAdjust } from '../hooks';
import { MapMode } from '../types';
import { IIndustry, TeleportCommunicator } from '@rrox-plugins/world/shared';
import { useRPC } from '@rrox/api';

export const Industry = React.memo( function Industry( { data }: { data: IIndustry } ) {
    const { utils, mode, settings, currentPlayerName } = useContext( MapContext )!;
    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    
    const { type, location, rotation, products, educts } = data;

    const teleport = useRPC( TeleportCommunicator );

    const definition = IndustryDefinitions[ type ];

    const tooltip = <MapTooltip
        title={definition.name}
        visible={tooltipVisible && mode !== MapMode.MINIMAP}
        setVisible={setTooltipVisible}
    >
        {(educts?.length > 0 || products?.length > 0) &&<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        {settings.features.teleport && <Button
            style={{ marginTop: 5 }}
            onClick={() => teleport( currentPlayerName, {
                X: location.X,
                Y: location.Y,
                Z: location.Z + 1000
            })}
        >Teleport Here</Button>}
        <StorageInfo
            title={definition.name}
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
    </MapTooltip>;

    if ( !definition.image )
        return <Shape
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
        >{tooltip}</Shape>;

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

    return <Image
        topLeft={topLeft}
        topRight={topRight}
        bottomLeft={bottomLeft}
        url={definition.image}
        interactive
    >
        {tooltip}
    </Image>;
} );