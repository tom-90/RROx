import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import {World} from "@rrox/types";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";
import AppIcon from '../assets/img/appIcon.ico';
import { io, Socket } from 'socket.io-client';

export function MapPage() {
    let { serverKey } = useParams();

    const socket = io("https://rrox.tom90.nl", { transports: [ 'websocket' ] } );

    if (serverKey !== undefined){
        socket.emit( 'join', serverKey, ( success: any ) => {
            console.log(success ? "connected" : "could not connect");
        });
    }

    socket.on( 'connect_error', ( error ) => {
        console.log('Socket connect error', error);
    });

    socket.on( 'disconnect', ( reason ) => {
        console.log('Socket disconnected. Reason:', reason);
    } );

    const [ mapData, setMapData ] = useState<World>( {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Sandhouses : [],
        Industries : [],
    } );

    const getSettings = () => ( {
        background: 1,
        minimapCorner: 0,
        transparent: false,
    } );

    const [ settings, setSettings ] = useState<MapSettings>( useMemo( getSettings, [] ) );
    const [ controlEnabled, setControlEnabled ] = useState( false );

    useEffect( () => {
        let data = { ...mapData };

        socket.on('broadcast', ( channel: string, ...args: any[] ) => {
            if (channel !== "map-update") return;
            let updateData = args[0][0];

            for (let i = 0; i < updateData.length; i++) {
                let updateItem = updateData[i];

                if (updateItem.Array === "Players"){
                    console.log(updateItem);

                    let PlayerData = updateItem.Data;
                    let PlayerId = PlayerData.ID;

                    data.Players = PlayerData;
                }
                if (updateItem.Array === "Frames"){
                    //console.log("Frames:", updateItem.Data);
                }
            }

        });

    }, [] );

    const actions = useMemo<MapActions>( () => ( {
        teleport         : ( x, y, z ) => {

        },
        changeSwitch     : ( id ) => {

        },
        setEngineControls: ( id, type, value ) => {

        },
        getColor         : ( key ) => '#000',
    } ), [ settings ] );

    return (
        <div className="page-container">
            <Map
                data={mapData}
                settings={settings}
                actions={actions}
                mode={MapMode.NORMAL}
                controlEnabled={controlEnabled}
            />
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}