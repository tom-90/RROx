import React, { useContext, useState } from 'react';
import { Industry as IndustryData } from "@rrox/types";
import { MapContext, MapMode } from '../context';
import { IndustryDefinitions } from '../definitions/Industry';
import { Image } from '../leaflet/image';
import { Shape } from '../leaflet/shape';
import { Button } from 'antd';
import { MapTooltip } from '../leaflet/tooltip';
import { StorageInfo } from '../popups/StorageInfo';
import { usePositions } from '../hooks/usePositions';
import { useImageAdjust } from '../hooks/useImageAdjust';

export const Industry = React.memo( function Industry( { data }: { data: IndustryData } ) {
    const { utils, mode, actions, features } = useContext( MapContext );
    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    
    const { Type, Location, Rotation, Products, Educts } = data;

    const definition = IndustryDefinitions[ Type ];

    const tooltip = <MapTooltip
        title={definition.name}
        visible={tooltipVisible && mode !== MapMode.MINIMAP}
        setVisible={setTooltipVisible}
    >
        {(Educts?.length > 0 || Products?.length > 0) &&<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        {features.teleport && <Button
            style={{ marginTop: 5 }}
            onClick={() => actions.teleport( data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] + 1000 )}
        >Teleport Here</Button>}
        <StorageInfo
            title={definition.name}
            storages={{
                Input: Educts,
                Output: Products
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
            anchor={utils.scalePoint( ...Location )}
            rotation={Math.round( Rotation[ 1 ] ) - 90}
            color={'black'}
            fillColor={definition.fillColor || 'grey'}
            fillOpacity={1}
            weight={60}
            interactive
        >{tooltip}</Shape>;

    const anchor = utils.scalePoint( ...Location );

    const [
        topLeft,
        topRight,
        bottomLeft
    ]: [ [ number, number ], [ number, number ], [ number, number ] ] = usePositions( [
        utils.scalePoint( ...definition.points[ 0 ] ),
        utils.scalePoint( ...definition.points[ 1 ] ),
        utils.scalePoint( ...definition.points[ 2 ] ),
    ], anchor, Rotation[ 1 ] );

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