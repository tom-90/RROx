import * as React from "react";
import {useEffect, useMemo, useState, useRef} from "react";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Input, Button, message } from "antd";
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

    return (
        <div className="page-container key-input-body">
            <div className="key-input-div">
                <div className="key-input-container">
                    TODO
                    {mapData.Players.map( ( p, i ) => <span key={i} onClick={() => selectPlayer( p.Name )}>{p.Name}</span>)}
                </div>
            </div>
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}