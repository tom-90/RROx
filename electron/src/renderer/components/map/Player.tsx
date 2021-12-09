import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { MapTooltip } from './Tooltip';
import { MapProperties } from './interfaces';
import { Player as PlayerData } from "../../../shared/data";
import { MapContext } from './context';

export const Player = React.memo( function( { data, map, index }: { data: PlayerData, map: MapProperties, index: number } ) {
    const { followElement, stopFollowing, following, minimap } = useContext( MapContext );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const playerRef = createRef<SVGPathElement>();

    const { Location, Rotation, Name } = data;
    const { imx, minX, imy, minY, scale } = map;

    const radius = 6 * scale;

    const x = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) );
    const y = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) );

    const yl = ( radius / 3 ) * 2;
    const xl = ( radius / 2 ) * 2;

    useEffect( () => {
        if( !following || following.type !== 'player' || following.index !== index || ( following.data === data && following.element === playerRef.current ) )
            return;
        followElement( 'player', index, playerRef.current, data );
    }, [ playerRef.current, data, following ] );

    return <MapTooltip
        title={Name}
        controls={<Button onClick={() => {
            if( following && following.type === 'player' && following.index === index )
                stopFollowing();
            else
                followElement( 'player', index, playerRef.current, data );
            setTooltipVisible( false );
        }}>{following && following.type === 'player' && following.index === index ? 'Unfollow' : 'Follow'}</Button>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <path
            transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
            d={"M" + ( x - ( radius / 2 ) ) + "," + y + " l " + ( xl / 3 ) + "," + ( yl / 2 ) + " l " + ( xl / 3 * 2 ) + ",0 l -" + ( xl / 3 ) + ",-" + ( yl / 2 ) + " l " + ( xl / 3 ) + ",-" + ( yl / 2 ) + " l -" + ( xl / 3 * 2 ) + ",0 z"}
            fill="blue"
            stroke="black"
            strokeWidth={2}
            className={'clickable highlight'}
            ref={playerRef}
        />
    </MapTooltip>;
} );