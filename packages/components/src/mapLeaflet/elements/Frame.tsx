import React, { useContext, useState, useEffect } from 'react';
import { Frame as FrameData } from "@rrox/types";
import { MapContext, MapMode } from '../context';
import { Shape } from '../leaflet/shape';
import { FrameDefinitions } from '../definitions/Frame';
import { MapTooltip } from '../leaflet/tooltip';
import { Button } from 'antd';
import { FrameControls } from '../popups/FrameControls';
import { StorageInfo } from '../popups/StorageInfo';
import { Cars } from '@rrox/types';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

export const Frame = React.memo( function Frame( { data }: { data: FrameData } ) {
    const { utils, mode, follow, actions, controlEnabled } = useContext( MapContext );
    const map = useMap();

    const { ID, Location, Rotation, Type, Freight, Number, Name } = data;

    const definition = FrameDefinitions[ Type ];

    const [ controlsVisible, setControlsVisible ] = useState( false );
    const [ storageVisible, setStorageVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    
    const anchor = utils.scalePoint( ...Location );

    useEffect( () => {
        if ( follow.array !== 'Frames' || follow.id !== ID || !follow.enabled )
            return;
        map.panTo( L.latLng( anchor[ 0 ], anchor[ 1 ] ), { animate: true, duration: 0.5 } );
    }, [ follow.enabled, follow.array, follow.id, anchor[ 0 ], anchor[ 1 ] ] );

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
                rotation={Math.round( Rotation[ 1 ] ) - 90}
                color={'black'}
                fillColor={actions.getColor( Type )}
                fillOpacity={1}
                interactive
            >
                <MapTooltip
                    title={`${Name.toUpperCase()}${Number ? ' - ' : ''}${Number.toUpperCase() || ''}`}
                    visible={tooltipVisible && mode !== MapMode.MINIMAP}
                    setVisible={setTooltipVisible}
                >
                    <img src={definition.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }} />
                    <Button onClick={() => {
                        setTooltipVisible( false );
                        setControlsVisible( true );
                    }}>Open Controls</Button>
                    <Button
                        style={{ marginTop: 5 }}
                        onClick={() => {
                            if ( follow.array === 'Frames' && follow.id === ID )
                                follow.setFollowing();
                            else
                                follow.setFollowing( 'Frames', ID );
                            setTooltipVisible( false );
                        }}
                    >
                        {follow && follow.array === 'Frames' && follow.id === ID ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button
                        style={{ marginTop: 5 }}
                        onClick={() => actions.teleport( data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] + 500, data.Name )}
                    >Teleport Here</Button>
                </MapTooltip>
                <FrameControls
                    title={`${Name.toUpperCase()}${Number ? ' - ' : ''}${Number.toUpperCase() || ''}`}
                    data={data}
                    id={ID}
                    isVisible={controlsVisible}
                    className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
                    controlEnabled={controlEnabled}
                    isEngine={true}
                    onClose={() => {
                        setControlsVisible( false );
                        setTooltipVisible( false );
                    }}
                />
            </Shape>;

    return <Shape
        positions={[
            utils.scalePoint( 100, definition.length / 2 ),
            utils.scalePoint( 100, -definition.length / 2 ),
            utils.scalePoint( -100, -definition.length / 2 ),
            utils.scalePoint( -100, definition.length / 2 ),
        ]}
        anchor={anchor}
        rotation={Math.round( Rotation[ 1 ] ) - 90}
        color={'black'}
        fillColor={definition.freight
                ? actions.getColor( `${Type}.${Freight && Freight.Amount > 0 ? 'loaded' : 'unloaded'}` )
                : actions.getColor( Type )}
        fillOpacity={1}
        interactive
    >
        <MapTooltip
            title={definition.name || 'Freight Car'}
            visible={tooltipVisible && mode !== MapMode.MINIMAP}
            setVisible={setTooltipVisible}
        >
            <img src={definition.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }} />
            <Button onClick={() => {
                setTooltipVisible( false );
                setControlsVisible( true );
            }}>Open Controls</Button>
            {data.Freight && <Button
                style={{ marginTop: 5 }}
                onClick={() => {
                    setTooltipVisible( false );
                    setStorageVisible( true );
                }}
            >Show Freight</Button>}
            {Type === Cars.CABOOSE && <Button
                style={{ marginTop: 5 }}
                onClick={() => actions.teleport( data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ], data.Name )}
            >Teleport Here</Button>}
        </MapTooltip>
        <FrameControls
            title={definition.name || 'Freight Car'}
            data={data}
            id={ID}
            isVisible={controlsVisible}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
            isEngine={false}
            controlEnabled={controlEnabled}
            onClose={() => {
                setControlsVisible( false );
                setTooltipVisible( false );
            }}
        />
        <StorageInfo
            title={definition.name || 'Freight Car'}
            className={mode === MapMode.MINIMAP ? 'modal-hidden' : undefined}
            storages={{
                Freight: Freight ? [ Freight ] : []
            }}
            isVisible={storageVisible}
            onClose={() => {
                setStorageVisible( false );
                setTooltipVisible( false );
            }}
        />
    </Shape>;
} );