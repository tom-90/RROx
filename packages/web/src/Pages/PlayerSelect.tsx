import * as React from "react";
import {useEffect, useMemo, useState, useRef} from "react";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import { useMapData } from "../helpers/mapData";
import { useSocketSession } from "../helpers/socket";
import { useSettings } from "../helpers/settings";

export function PlayerSelect() {
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded } = useMapData();
    const [ settings, setSettings ] = useSettings();

    // When this page loads, we refresh the map data
    useEffect( () => {
        if( !mapDataLoaded )
            refreshMapData();
    }, [] );

    const selectPlayer = ( name: string ) => {
        setSettings( {
            selectedPlayer: name,
        } );
        navigate( `/${serverKey}` );
    };

    let Players = [
        (<Button className="player-select-item" type="primary" size="large" loading={true} key="loading">Loading</Button>)
    ];
    Players = mapData.Players.map( ( p, i ) => <Button className="player-select-item" type="primary" size="large" key={i} onClick={() => selectPlayer( p.Name )}>{p.Name}</Button>);

    return (
        <div className="page-container key-input-body">
            <div className="player-select-div">
                <div className="player-select-container">
                    <h1>Select A Player</h1>
                    {Players}
                </div>
            </div>
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}