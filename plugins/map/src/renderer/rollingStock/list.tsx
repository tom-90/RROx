import { PageContent, PageLayout } from "@rrox/base-ui";
import { useWorld } from "@rrox-plugins/world/renderer";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { FrameDefinitions } from "../map/definitions";
import { FrameCarType } from "@rrox-plugins/world/shared";
import { FramesList } from "./frames";

export function RollingStockListPage() {
    const navigate = useNavigate();

    const world = useWorld();

    const openControl = ( index: number ) => {
        navigate( `/@rrox-plugins/map/controls/${index}` );
    };

    const locate = ( index: number ) => {
        navigate( '/@rrox-plugins/map/map', {
            state: {
                locate: {
                    type : 'frameCars',
                    index: index,
                }
            }
        } );
    }

    return (
        <PageLayout>
            <PageContent style={{ maxWidth: 1200 }}>
                <Tabs defaultActiveKey="1" style={{ margin: '0 10px' }} centered>
                    <Tabs.TabPane tab="Locomotives" key="1" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={world?.frameCars.map( ( frame, index ) => ( { frame, index } ) ).filter( ( { frame } ) => FrameDefinitions[ frame.type ].engine ) ?? []}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Freight Cars" key="2" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={world?.frameCars.map( ( frame, index ) => ( { frame, index } ) ).filter( ( { frame } ) => FrameDefinitions[ frame.type ].freight ) ?? []}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Tenders" key="3" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={world?.frameCars.map( ( frame, index ) => ( { frame, index } ) ).filter( ( { frame } ) => FrameDefinitions[ frame.type ].tender) ?? []}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </Tabs.TabPane>
					
					<Tabs.TabPane tab="Cabooses &#38; Miscellaneous" key="4" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={world?.frameCars.map( ( frame, index ) => ( { frame, index } ) ).filter( ( { frame } ) => frame.type === FrameCarType.CABOOSE || frame.type === FrameCarType.WAYCAR || frame.type === FrameCarType.PLOW || frame.type === FrameCarType.COACH_DSPRR_1) ?? []}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </Tabs.TabPane>

                </Tabs>
            </PageContent>
        </PageLayout>
    );
}