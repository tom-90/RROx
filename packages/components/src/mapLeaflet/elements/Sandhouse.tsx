import React, { useContext, useState, useRef } from 'react';
import { Sandhouse as SandhouseData } from "@rrox/types";
import { MapContext, MapMode } from '../context';
import { SandhouseDefinitions } from '../definitions/Sandhouse';
import { Image } from '../leaflet/image';
import L from 'leaflet';
import { Button } from 'antd';
import { MapTooltip } from '../leaflet/tooltip';
import { StorageInfo } from '../popups/StorageInfo';
import { usePositions } from '../hooks/usePositions';
import { useImageAdjust } from '../hooks/useImageAdjust';
import { Circle, Marker } from 'react-leaflet';

export const Sandhouse = React.memo( function Sandhouse( { data }: { data: SandhouseData } ) {
    const { utils, mode, actions, features } = useContext( MapContext );

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const { Location, Rotation, Storage } = data;
    
    const anchor = utils.scalePoint( ...Location );

    const [
        topLeft,
        topRight,
        bottomLeft
    ]: [ [ number, number ], [ number, number ], [ number, number ] ] = usePositions( [
        utils.scalePoint( ...SandhouseDefinitions.points[ 0 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 1 ] ),
        utils.scalePoint( ...SandhouseDefinitions.points[ 2 ] ),
    ], anchor, Rotation[ 1 ] );

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
            {features.teleport && <Button
                style={{ marginTop: 5 }}
                onClick={() => actions.teleport( data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] + 1000 )}
            >Teleport Here</Button>}
            <StorageInfo
                title={'Sandhouse'}
                storages={{
                    'Sand Level': [ Storage ],
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