import React, { useContext, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { MapTooltip } from './tooltip';
import { Button } from 'antd';
import { MapContext } from '../context';
import { MapMode } from '../types';
import { useRPC } from '@rrox/api';
import { TeleportCommunicator } from '@rrox-plugins/world/shared';

export function ContextMenu() {
    const [ visible, setVisible ] = useState( false );
    const [ position, setPosition ] = useState<[ lat: number, lng: number ]>( [ 0, 0 ] );
    const { currentPlayerName, utils, mode, settings } = useContext( MapContext )!;

    const teleport = useRPC( TeleportCommunicator );

    useMapEvents( {
        contextmenu: ( e ) => {
            setPosition( [ e.latlng.lat, e.latlng.lng ] );
            setVisible( true );
        }
    } );

    if( !visible || !settings.features.teleport )
        return null;

    return <MapTooltip
        visible={visible && mode !== MapMode.MINIMAP}
        setVisible={setVisible}
        position={position}
    >
        <Button
            style={{ marginTop: 5 }}
            onClick={() => {
                const [ X, Y ] = utils.revertScalePoint( ...position )
                teleport( currentPlayerName, {
                    X,
                    Y
                } );
            }}
        >Teleport Here</Button>
    </MapTooltip>;
};