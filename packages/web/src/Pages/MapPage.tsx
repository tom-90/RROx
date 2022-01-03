import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import {World} from "@rrox/types";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { io, Socket } from 'socket.io-client';

export function MapPage() {
    let { serverKey } = useParams();

    const socket = useMemo(() => {
        return io("https://rrox.tom90.nl", {
            transports: [ 'websocket' ],
            autoConnect: false
        } );
    }, []);

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
        background: 6,
        minimapCorner: 0,
        transparent: false,
    } );

    const [ settings, setSettings ] = useState<MapSettings>( useMemo( getSettings, [] ) );
    const [ controlEnabled, setControlEnabled ] = useState( true );

    useEffect( () => {
        let data = { ...mapData };

        socket.connect();
        if (serverKey !== undefined){
            socket.emit( 'join', serverKey, ( success: any ) => {
                console.log(success ? "connected" : "could not connect");
                socket.emit( 'rpc', 'map-data', [], ( joinData : any ) => {
                    data = joinData;
                    setMapData(joinData);
                });
            });
        }

        socket.on( 'connect_error', ( error ) => {
            console.log('Socket connect error', error);
        });

        socket.on( 'disconnect', ( reason ) => {
            console.log('Socket disconnected. Reason:', reason);
        } );

        socket.on('broadcast', ( channel: string, changes: any[] ) => {
            if (channel !== "map-update") return;
            changes = changes[0];

            data = { ...data };

            // We sort the indices in reverse order, such that we can safely remove all of them
            changes = changes.sort( ( a, b ) => b.Index - a.Index );

            changes.forEach( ( c ) => {
                let array = data[ c.Array as keyof typeof mapData ];

                if( c.ChangeType === 'ADD' || c.ChangeType === 'UPDATE' )
                    array[ c.Index ] = c.Data! as any;
                else if( c.ChangeType === 'REMOVE' )
                    array.splice( c.Index, 1 );
            } );

            setMapData( data );
        });
    }, [] );

    const actions = useMemo<MapActions>( () => ( {
        teleport         : ( x, y, z, name ) => {
            socket.emit( 'rpc', 'teleport', [x, y, z, name]);
        },
        changeSwitch     : ( id ) => {
            socket.emit( 'rpc', 'change-switch', [id]);
        },
        setEngineControls: ( id, type, value ) => {
            socket.emit( 'rpc', 'set-engine-controls', [id, type, value]);
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