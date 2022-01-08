import React, { useContext, useEffect, useState } from 'react';
import L from 'leaflet';
import { Player as PlayerData } from "@rrox/types";
import { MapContext, MapMode } from '../context';
import { Shape } from '../leaflet/shape';
import { useMap } from 'react-leaflet';
import { MapTooltip } from '../leaflet/tooltip';
import { Button } from 'antd';

export const Player = React.memo( function Player( { data }: { data: PlayerData } ) {
    const { utils, follow, mode, actions } = useContext( MapContext );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const map = useMap();

    const { ID, Location, Rotation, Name } = data;

    const anchor = utils.scalePoint( ...Location );

    return <Shape
        positions={[
            utils.scalePoint( 0, 150 ),
            utils.scalePoint( 100, 50 ),
            utils.scalePoint( 100, -150 ),
            utils.scalePoint( -100, -150 ),
            utils.scalePoint( -100, 50 ),
        ]}
        anchor={anchor}
        rotation={Math.round( Rotation[ 1 ] ) - 90}
        color={'black'}
        fillColor={actions.getColor( 'player' )}
        fillOpacity={1}
        interactive
        weight={60}
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
                    follow.setFollowing( 'Players', ID, ( data, map ) => {
                        const anchor = utils.scalePoint( ...data.Location );
                        map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
                    } );
                setTooltipVisible( false );
            }}>{follow.array === 'Players' || follow.id === ID ? 'Unfollow' : 'Follow'}</Button>
        </MapTooltip>
    </Shape>;
} );