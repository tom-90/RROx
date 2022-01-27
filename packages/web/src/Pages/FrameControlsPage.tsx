import * as React from "react";
import {useEffect, useMemo} from "react";
import { Layout } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { FramesList } from "@rrox/components";
import { FrameDefinitions } from '@rrox/components/src/mapLeaflet/definitions/Frame';
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { Tabs } from "antd";
import { Cars } from "@rrox/types";
const { TabPane } = Tabs;

export function FrameControlsPage() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded } = useMapData();
    const [ settings ] = useSettings();

    // When this page loads, we refresh the map data
    useEffect( () => {
        if( !mapDataLoaded )
            refreshMapData();
    }, [] );
    
    // When the map data loads, we check if we have a selected player
    useEffect( () => {
        // If we do not have a selected player, or the selected player is not in the world
        // Then we redirect to the select player page
        if( mapData.Players.length > 0 && ( !settings[ 'multiplayer.client.playerName' ] || !mapData.Players.some( ( p ) => p.Name === settings[ 'multiplayer.client.playerName' ] ) ) )
            navigate( `/${serverKey}/players` );
    }, [ mapData, settings ] );

    const openControl = ( ID: number ) => {
        navigate( `/${serverKey}/controls/frames/${ID}` );
    };

    const locate = ( ID: number ) => {
        navigate( `/${serverKey}`, {
            state: {
                locate: {
                    type: 'Frames',
                    id  : ID,
                }
            }
        } );
    }

    return (

        <MapPageLayout  style={{ overflowY: 'hidden', marginLeft: '5px', marginRight: '5px' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: '50px' }}>
                <Tabs defaultActiveKey="1">

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
        </MapPageLayout>
    );
}