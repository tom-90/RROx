import React, { useContext, useState } from 'react';
import { MapContext } from '../context';
import { Shape, MapTooltip } from '../leaflet';
import { FrameDefinitions } from '../definitions';
import { Button } from 'antd';
import { FrameControlsPopup, StorageInfo } from '../popups';
import L from 'leaflet';
import { IFrameCar, FrameCarType, EngineFrameCarType, FreightFrameCarType, TeleportCommunicator } from '@rrox-plugins/world/shared';
import { MapMode } from '../types';
import { useRPC } from '@rrox/api';
import { usePopupElements } from '../hooks';

const getStrokeColor = ( brake: number ) => {
    if( brake > 0.5 )
        return 'red';
    else if( brake > 0.2 )
        return 'orange';
    else
        return 'black';
};

export const Frame = React.memo( function Frame( { data, index, frames }: { data: IFrameCar, index: number, frames: IFrameCar[] } ) {
    const { utils, mode, follow, settings, preferences, currentPlayerName } = useContext( MapContext )!;

    const { location, rotation, type, freight, number, name, controls } = data;

    const definition = FrameDefinitions[ type ];

    const teleport = useRPC( TeleportCommunicator );

    const [ controlsVisible, setControlsVisible ] = useState( false );
    const [ storageVisible, setStorageVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    
    const popupElements = usePopupElements( { frame: data, index } );

    const anchor = utils.scaleLocation( location );

    if( definition.engine )
        return <Shape
                positions={[
                    utils.scalePoint( 0, definition.length / 2 ),
                    utils.scalePoint( 100, definition.length / 6 ),
                    utils.scalePoint( 100, -definition.length / 2 ),
                    utils.scalePoint( -100, -definition.length / 2 ),
                    utils.scalePoint( -100, definition.length / 6 ),
                ]}
                anchor={anchor}
                rotation={Math.round( rotation.Yaw ) - 90}
                color={getStrokeColor( controls.brake )}
                fillColor={preferences.colors[ type as EngineFrameCarType ]}
                fillOpacity={1}
                interactive
            >
                <MapTooltip
                    title={`${name.replace("<br>", "").toUpperCase()}${name && number ? ' - ' : ''}${number.toUpperCase() || ''}`}
                    visible={tooltipVisible && mode !== MapMode.MINIMAP}
                    setVisible={setTooltipVisible}
                >
                    {definition.image && <img className='dark-mode-invert' src={definition.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }} alt="Tooltip Icon" />}
                    <Button onClick={() => {
                        setTooltipVisible( false );
                        setControlsVisible( true );
                    }}>Open Controls</Button>
                    <Button
                        style={{ marginTop: 5 }}
                        onClick={() => {
                            if ( follow.following?.array === 'frameCars' && follow.following?.index === index )
                                follow.setFollowing();
                            else
                                follow.setFollowing( {
                                    array: 'frameCars',
                                    index,
                                    apply: ( data, map ) => {
                                        const anchor = utils.scaleLocation( data.location );
                                        map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
                                    }
                                } );
                            setTooltipVisible( false );
                        }}
                    >
                        {follow.following?.array === 'frameCars' && follow.following.index === index ? 'Unfollow' : 'Follow'}
                    </Button>
                    {popupElements}
                </MapTooltip>
                <FrameControlsPopup
                    title={`${name.replace("<br>", "").toUpperCase()}${name && number ? ' - ' : ''}${number.toUpperCase() || ''}`}
                    data={data}
                    frames={frames}
                    index={index}
                    isVisible={controlsVisible}
                    className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
                    controlEnabled={settings.features.controlEngines}
                    onClose={() => {
                        setControlsVisible( false );
                        setTooltipVisible( false );
                    }}
                />
            </Shape>;

    let frameTitle = name || number ? (name.replace("<br>", "").toUpperCase()) + (name && number ? ' - ' : '') + (number.toUpperCase() || '') : (definition.name || 'Freight Car');

    return <Shape
        positions={[
            utils.scalePoint( 100, definition.length / 2 ),
            utils.scalePoint( 100, -definition.length / 2 ),
            utils.scalePoint( -100, -definition.length / 2 ),
            utils.scalePoint( -100, definition.length / 2 ),
        ]}
        anchor={anchor}
        rotation={Math.round( rotation.Yaw ) - 90}
        color={getStrokeColor( controls.brake )}
        fillColor={definition.freight
                ? preferences.colors[ type as FreightFrameCarType ][ freight && freight.currentAmount > 0 ? 'loaded' : 'unloaded' ]
                : preferences.colors[ type as EngineFrameCarType ]}
        fillOpacity={1}
        interactive
    >
        <MapTooltip
            title={frameTitle}
            visible={tooltipVisible && mode !== MapMode.MINIMAP}
            setVisible={setTooltipVisible}
        >
            {definition.image && <img className='dark-mode-invert' src={definition.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }} alt="Tooltip Icon"/>}
            <Button onClick={() => {
                setTooltipVisible( false );
                setControlsVisible( true );
            }}>Open Controls</Button>
            {data.freight && <Button
                style={{ marginTop: 5 }}
                onClick={() => {
                    setTooltipVisible( false );
                    setStorageVisible( true );
                }}
            >Show Freight</Button>}
            {popupElements}
        </MapTooltip>
        <FrameControlsPopup
            title={frameTitle}
            data={data}
            frames={frames}
            index={index}
            isVisible={controlsVisible}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
            controlEnabled={settings.features.controlEngines}
            onClose={() => {
                setControlsVisible( false );
                setTooltipVisible( false );
            }}
        />
        <StorageInfo
            title={frameTitle}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
            storages={{
                Freight: freight ? [ freight ] : []
            }}
            isVisible={storageVisible}
            onClose={() => {
                setStorageVisible( false );
                setTooltipVisible( false );
            }}
        />
    </Shape>;
} );