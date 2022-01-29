import React from "react";
import { useNavigate } from "react-router-dom";
import { FramesList, FrameDefinitions } from "@rrox/components";
import { PageLayout } from "../components/PageLayout";
import { Tabs } from "antd";
import { Cars } from "@rrox/types";
import { useMapData } from "../hooks/useMapData";
const { TabPane } = Tabs;

export function RollingStockPage() {
    const navigate = useNavigate();

    const { mapData } = useMapData();

    const openControl = ( ID: number ) => {
        navigate( `/controls/${ID}` );
    };

    const locate = ( ID: number ) => {
        navigate( '/map', {
            state: {
                locate: {
                    type: 'Frames',
                    id  : ID,
                }
            }
        } );
    }
    return (
        <PageLayout  style={{ overflowY: 'hidden', marginLeft: '5px', marginRight: '5px' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: '50px' }}>
                <Tabs defaultActiveKey="1" style={{ margin: '0 10px' }}>

                    <TabPane tab="Locomotives" key="1" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={mapData.Frames.filter( ( frame ) => FrameDefinitions[ frame.Type ].engine )}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </TabPane>

                    <TabPane tab="Freight Cars" key="2" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={mapData.Frames.filter( ( frame ) => FrameDefinitions[ frame.Type ].freight )}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </TabPane>

                    <TabPane tab="Tenders &#38; Cabooses" key="3" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        <FramesList
                            data={mapData.Frames.filter( ( frame ) => FrameDefinitions[ frame.Type ].tender || frame.Type === Cars.CABOOSE )}
                            onOpenControls={openControl}
                            onLocate={locate}
                        />
                    </TabPane>

                </Tabs>
            </div>
        </PageLayout>
    );
}