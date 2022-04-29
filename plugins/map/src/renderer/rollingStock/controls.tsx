import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { NotFoundPage, PageContent, PageLayout } from "@rrox/base-ui";
import { FrameControls } from "../map/components";
import { useWorld } from "@rrox-plugins/world/renderer";
import { useSettings } from "@rrox/api";
import { WorldSettings } from "@rrox-plugins/world/shared";

export function ControlsPage() {
    let { index } = useParams();
    const navigate = useNavigate();

    const world = useWorld();
    const [ settings ] = useSettings( WorldSettings );

    const frameIndex = parseInt( index! );

    let data = world?.frameCars[ frameIndex ];

    if( !world || !data )
        return <NotFoundPage />;

    return (
        <PageLayout>
            <PageContent style={{ maxWidth: 1200 }}>
                <div>
                    <Button type="link" onClick={() => navigate( -1 )}><LeftOutlined/> Go Back</Button>
                    <Typography.Title level={3} style={{ textAlign: 'center' }}>
                        {data.name.toUpperCase()}{data.name && data.number ? ' - ' : ''}{data.number.toUpperCase() || ''}
                    </Typography.Title>
                </div>
                <div>
                    <FrameControls
                        index={frameIndex}
                        data={data}
                        controlEnabled={settings.features.controlEngines}
                        frames={world.frameCars}
                    />
                </div>
            </PageContent>
        </PageLayout>
    );

}