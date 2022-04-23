import React, { useContext, useState } from 'react';
import { MapContext } from '../context';
import { SandhouseDefinitions } from '../definitions';
import { Image, MapTooltip } from '../leaflet';
import { Button } from 'antd';
import { StorageInfo } from '../popups';
import { usePositions } from '../hooks';
import { ISandhouse, TeleportCommunicator } from '@rrox/world/shared';
import { MapMode } from '../types';
import { useRPC } from '@rrox/api';

export const Sandhouse = React.memo( function Sandhouse( { data }: { data: ISandhouse } ) {
    const { utils, mode, settings, currentPlayerName } = useContext( MapContext )!;

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const { location, rotation, sandStorage } = data;
    
    const anchor = utils.scaleLocation( location );

    const teleport = useRPC( TeleportCommunicator );

    const [
        topLeft,
        topRight,
        bottomLeft
    ]: [ [ number, number ], [ number, number ], [ number, number ] ] = usePositions( [
        utils.scalePoint( ...SandhouseDefinitions.points[ 0 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 1 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 2 ] ),
    ], anchor, rotation.Yaw );

    /*const { points, markers } = useImageAdjust( [
        utils.scalePoint( ...SandhouseDefinitions.points[ 0 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 1 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 2 ] ),
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
        url={SandhouseDefinitions.image}
        interactive={true}
    >
        <MapTooltip
            title={'Sandhouse'}
            visible={tooltipVisible && mode !== MapMode.MINIMAP}
            setVisible={setTooltipVisible}
        >
            <Button onClick={() => {
                setTooltipVisible( false );
                setInfoVisible( true );
            }}>Show Info</Button>
            {settings[ 'features.teleport' ] && <Button
                style={{ marginTop: 5 }}
                onClick={() => teleport( currentPlayerName, {
                    X: location.X,
                    Y: location.Y,
                    Z: location.Z + 1000
                } )}
            >Teleport Here</Button>}
            <StorageInfo
                title={'Sandhouse'}
                storages={{
                    'Sand Level': [ sandStorage ],
                }}
                className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
                isVisible={infoVisible}
                onClose={() => {
                    setInfoVisible( false );
                    setTooltipVisible( false );
                }}
            />
        </MapTooltip>
    </Image>;
} );