import * as React from "react";
import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Skeleton, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { FrameDefinitions } from '@rrox/components/src/mapLeaflet/definitions/Frame';
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { FrameControls } from "@rrox/components/src/components/frameControls";

export function FrameControlPage() {
    let { serverKey, id } = useParams();
    const navigate = useNavigate();

    useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, features, actions: actions } = useMapData();
    const [ settings ] = useSettings();

    // When this page loads, we refresh the map data
    useEffect( () => {
        if ( !mapDataLoaded )
            refreshMapData();
    }, [] );

    // When the map data loads, we check if we have a selected player
    useEffect( () => {
        // If we do not have a selected player, or the selected player is not in the world
        // Then we redirect to the select player page
        if ( mapData.Players.length > 0 && ( !settings[ 'multiplayer.client.playerName' ] || !mapData.Players.some( ( p ) => p.Name === settings[ 'multiplayer.client.playerName' ] ) ) )
            navigate( `/${serverKey}/players` );
    }, [ mapData, settings ] );

    const frameId = parseInt( id );

    let data = mapData?.Frames.filter( frame => frame.ID === frameId ).filter( frame => FrameDefinitions[ frame.Type ].engine )[ 0 ];

    if ( !mapDataLoaded || !data ) 
        return <Skeleton />;

    const { Name, Number } = data;

    return (
        <MapPageLayout style={{ overflowY: 'auto', marginLeft: '5px', marginRight: '5px' }}>
            <div className='control-page-title'>
                <Button type="link" onClick={() => navigate( -1 )}><LeftOutlined/> Go Back</Button>
                <Typography.Title level={3}>
                    {Name.toUpperCase()}{Name && Number ? ' - ' : ''}{Number.toUpperCase() || ''}
                </Typography.Title>
            </div>
            <div className='controls-container'>
                <FrameControls
                    data={data}
                    frames={mapData?.Frames}
                    controlEnabled={features.controlEngines}
                    setEngineControls={actions.setEngineControls}
                    setControlsSynced={actions.setControlsSynced}
                />
            </div>
        </MapPageLayout>
    );

}