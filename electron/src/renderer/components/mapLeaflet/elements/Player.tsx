import React, { useContext, useEffect, useState } from 'react';
import L from 'leaflet';
import { Player as PlayerData } from "../../../../shared/data";
import { MapContext, MapMode } from '../context';
import { Shape } from '../leaflet/shape';
import { useMap } from 'react-leaflet';
import { MapTooltip } from '../leaflet/tooltip';
import { Button } from 'antd';

export const Player = React.memo( function Player( { data }: { data: PlayerData } ) {
    const { utils, follow, mode } = useContext( MapContext );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const map = useMap();

    const { ID, Location, Rotation, Name } = data;

    const anchor = utils.scalePoint( ...Location );

    useEffect( () => {
        if( follow.array !== 'Players' || follow.id !== ID || !follow.enabled )
            return;
        map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
    }, [ follow.enabled, follow.array, follow.id, anchor[ 0 ], anchor[ 1 ] ] );

    return <Shape
        positions={[
            utils.scalePoint( 0, 150 ),
            utils.scalePoint( 100, 50 ),
            utils.scalePoint( 100, -150 ),
            utils.scalePoint( 0, -50 ),
            utils.scalePoint( -100, -150 ),
            utils.scalePoint( -100, 50 ),
        ]}
        anchor={anchor}
        rotation={Math.round( Rotation[ 1 ] ) - 90}
        color={'black'}
        fillColor={'blue'}
        fillOpacity={1}
        interactive
    >
        <MapTooltip
            title={Name}
            visible={tooltipVisible && mode !== MapMode.MINIMAP}
            setVisible={setTooltipVisible}
        >
            <Button onClick={() => {
                if ( follow.array === 'Players' || follow.id === ID )
                    follow.setFollowing();
                else
                    follow.setFollowing( 'Players', ID );
                setTooltipVisible( false );
            }}>{follow.array === 'Players' || follow.id === ID ? 'Unfollow' : 'Follow'}</Button>
        </MapTooltip>
    </Shape>;
} );