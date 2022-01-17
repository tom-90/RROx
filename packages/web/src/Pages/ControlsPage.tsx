import * as React from "react";
import {useEffect, useMemo} from "react";
import { Layout } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";
import { FrameDefinitions } from '@rrox/components/src/mapLeaflet/definitions/Frame';
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { Tabs } from "antd";
const { TabPane } = Tabs;

export function ControlsPage() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, controlEnabled } = useMapData();
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

    const openControl = (id : any) => {
        let location = window.location.href;
        let page = `${id}`;
        window.open(location.endsWith("/") ? location + page : location + `/` + page, '_self').focus();
    };

    let Locomotives = mapData.Frames.filter(frame => FrameDefinitions[ frame.Type ].engine).map( ( Frame ) => {
        let Name = Frame.Name.replace("<br>", "");
        let Number = Frame.Number;

        let BoilerPressure = Frame.BoilerPressure;
        let BoilerPressureColor = BoilerPressure < 80 ? "red" : "black";
        let FuelAmount = Frame.FuelAmount;
        let FuelAmountColor = FuelAmount < 10 ? "red" : "black";
        let FireTemperature = Frame.FireTemperature;
        let FireTemperatureColor = FireTemperature < 100 ? "red" : "black";
        let WaterTemperature = Frame.WaterTemperature;
        let WaterTemperatureColor = WaterTemperature < 100 ? "red" : "black";

        return (
            <div className="control-locomotive" key={Frame.ID} onClick={() => {openControl(Frame.ID);}}>
                <h1> {`${Name.toUpperCase()}${Name && Number ? ' - ' : ''}${Number.toUpperCase() || ''}${Name || Number ? ' | ' : ''}`} {FrameDefinitions[ Frame.Type ].name}</h1>
                <table style={{ width: '50%' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Boiler Pressure</th>
                        <th style={{ width: '25%' }}>Fuel Amount</th>
                        <th style={{ width: '25%' }}>Fire Temp.</th>
                        <th style={{ width: '25%' }}>Water Temp.</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: 'center', color: BoilerPressureColor }}>{BoilerPressure.toFixed(0)}</td>
                        <td style={{ textAlign: 'center', color: FuelAmountColor }}>{FuelAmount.toFixed(0)}</td>
                        <td style={{ textAlign: 'center', color: FireTemperatureColor }}>{FireTemperature.toFixed(0)}</td>
                        <td style={{ textAlign: 'center', color: WaterTemperatureColor }}>{WaterTemperature.toFixed(0)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    });

    return (

        <MapPageLayout  style={{ overflowY: 'hidden', marginLeft: '5px', marginRight: '5px' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: '50px' }}>
                <Tabs defaultActiveKey="1">

                    <TabPane tab="Locomotives" key="1" style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
                        {Locomotives}
                    </TabPane>

                </Tabs>
            </div>
        </MapPageLayout>
    );
}