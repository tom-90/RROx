import React, { useContext, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { MapTooltip } from './tooltip';
import { Button } from 'antd';
import { MapContext, MapMode } from '..';

export function ContextMenu() {
    const [ visible, setVisible ] = useState( false );
    const [ position, setPosition ] = useState<[ lat: number, lng: number ]>( [ 0, 0 ] );
    const { actions, utils, mode, features } = useContext( MapContext );

    useMapEvents( {
        contextmenu: ( e ) => {
            setPosition( [ e.latlng.lat, e.latlng.lng ] );
            setVisible( true );
        }
    } );

    if( !visible || !features.teleport )
        return null;

    return <MapTooltip
        visible={visible && mode !== MapMode.MINIMAP}
        setVisible={setVisible}
        position={position}
    >
        <Button
            style={{ marginTop: 5 }}
            onClick={() => actions.teleport( ...utils.revertScalePoint( ...position ) )}
        >Teleport Here</Button>
    </MapTooltip>;
};