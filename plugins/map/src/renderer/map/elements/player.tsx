import React, { useContext, useState } from 'react';
import L from 'leaflet';
import { MapContext } from '../context';
import { Shape, MapTooltip } from '../leaflet';
import { Button } from 'antd';
import { Cheats } from '../popups';
import { IPlayer } from '@rrox/world/shared';
import { MapMode } from '../types';

export const Player = React.memo( function Player( { data, index }: { data: IPlayer, index: number } ) {
    const { utils, follow, mode, settings } = useContext( MapContext )!;
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const [ cheatsVisible, setCheatsVisible ] = useState( false );

    const { location, rotation, name } = data;

    const anchor = utils.scaleLocation( location );

    return <Shape
        positions={[
            utils.scalePoint( 0, 150 ),
            utils.scalePoint( 100, 50 ),
            utils.scalePoint( 100, -150 ),
            utils.scalePoint( -100, -150 ),
            utils.scalePoint( -100, 50 ),
        ]}
        anchor={anchor}
        rotation={Math.round( rotation.Yaw ) - 90}
        color={'black'}
        fillColor={settings[ 'colors.player' ]}
        fillOpacity={1}
        interactive
        weight={60}
    >
        <MapTooltip
            title={name}
            visible={tooltipVisible && mode !== MapMode.MINIMAP}
            setVisible={setTooltipVisible}
        >
            <Button onClick={() => {
                if ( follow.following?.array === 'players' || follow.following?.index === index )
                    follow.setFollowing();
                else
                    follow.setFollowing( {
                        array: 'players',
                        index,
                        apply: ( data, map ) => {
                            const anchor = utils.scaleLocation( data.location );
                            map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
                        }
                    } );
                setTooltipVisible( false );
            }}>{follow.following?.array === 'players' || follow.following?.index === index ? 'Unfollow' : 'Follow'}</Button>
            {settings[ 'features.cheats' ] && <Button
                style={{ marginTop: 5 }}
                onClick={() => {
                    setTooltipVisible( false );
                    setCheatsVisible( true );
                }}
            >Cheats</Button>}
        </MapTooltip>
        <Cheats
            data={data}
            isVisible={cheatsVisible} 
            onClose={() => setCheatsVisible( false )}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
        />
    </Shape>;
} );