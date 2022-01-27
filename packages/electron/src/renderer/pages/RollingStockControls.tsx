import * as React from "react";
import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Skeleton, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { PageLayout } from "../components/PageLayout";
import { FrameDefinitions } from '@rrox/components/src/mapLeaflet/definitions/Frame';
import { EngineControls } from '@rrox/types';
import { FrameControls } from "@rrox/components/src/components/frameControls";
import { useMapData } from "../hooks/useMapData";

export function RollingStockControlsPage() {
    let { serverKey, id } = useParams();
    const navigate = useNavigate();

    const { mapData, features } = useMapData();

    const frameId = parseInt( id );

    const setEngineControls = useCallback( ( id: number, type: EngineControls, value: number ) => {
        window.ipc.send( 'set-engine-controls', id, type, value );
    }, [ frameId ] );

    const setControlsSynced = useCallback( ( id: number, enabled: boolean ) => {
        window.ipc.send( 'set-sync-controls', id, enabled );
    }, [ frameId ] );

    let data = mapData.Frames.filter( frame => frame.ID === frameId ).filter( frame => FrameDefinitions[ frame.Type ].engine )[ 0 ];

    const { Name, Number } = data;

    return (
        <PageLayout style={{ overflowY: 'auto', marginLeft: '5px', marginRight: '5px' }}>
            <div className='control-page-title'>
                <Button type="link" onClick={() => navigate( -1 )}><LeftOutlined/> Go Back</Button>
                <Typography.Title level={3}>
                    {Name.toUpperCase()}{Name && Number ? ' - ' : ''}{Number.toUpperCase() || ''}
                </Typography.Title>
            </div>
            <div className='controls-container'>
                <FrameControls
                    data={data}
                    setEngineControls={setEngineControls}
                    setControlsSynced={setControlsSynced}
                    frames={mapData.Frames}
                    controlEnabled={features.controlEngines}
                />
            </div>
        </PageLayout>
    );

}