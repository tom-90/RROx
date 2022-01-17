import * as React from "react";
import {useEffect, useState, useMemo, useContext } from "react";
import { Layout, Slider } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";
import { FrameDefinitions } from '@rrox/components/src/mapLeaflet/definitions/Frame';
import AppIcon from '@rrox/assets/images/appicon.ico';
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { EngineControls } from '@rrox/types';
import { MapContext } from '@rrox/components/src/mapLeaflet/context';

function throttle<P extends any[]>( fn: ( ...args: P ) => void, wait: number ): ( ...args: P ) => void {
    let latestArgs: P;
    let timeout: NodeJS.Timeout = null;
    return function ( ...args: P ) {
        if ( timeout !== null ) {
            latestArgs = args;
        } else {
            timeout = setTimeout( () => {
                if ( latestArgs )
                    fn( ...latestArgs );
                clearTimeout( timeout );
                timeout = null;
                latestArgs = null;
            }, wait );
            fn( ...args );
        }
    }
}

export function ControlPage() {
    let { serverKey, id } = useParams();
    const navigate = useNavigate();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, controlEnabled, actions: actions } = useMapData();
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

    let frameId = parseInt(id);
    let isVisible = true;
    let data = mapData.Frames.filter(frame => frame.ID === frameId).filter(frame => FrameDefinitions[ frame.Type ].engine)[0];

    if (mapDataLoaded){
        if (data === undefined){
            let location = window.location.origin;
            let page = `${serverKey}/controls`;
            window.open(location.endsWith("/") ? location + page : location + `/` + page, '_self').focus();
        }
    }

    const { Regulator, Reverser, Brake, Whistle, Generator, Compressor, BoilerPressure, WaterTemperature, FireTemperature, FuelAmount, AirPressure, WaterLevel, Speed, MaxSpeed } = data || {};

    const [ controls, setControls ] = useState<{
        Regulator: number,
        Reverser: number,
        Brake: number,
        Whistle: number,
        Generator: number,
        Compressor: number
    }>( { Regulator, Reverser, Brake, Whistle, Generator, Compressor } );

    const [ compact, setCompact ] = useState( false );

    const setWhistle = useMemo( () => {
        return throttle( ( value: number ) => {
            actions.setEngineControls( frameId, EngineControls.WHISTLE, value / 100 );
        }, 100 );
    }, [ actions.setEngineControls, frameId ] );

    useEffect( () => {
        if ( !isVisible ||
            ( controls.Regulator === Regulator
                && controls.Reverser === Reverser
                && controls.Brake === Brake
                && controls.Whistle === Whistle
                && controls.Generator === Generator
                && controls.Compressor === Compressor ) )
            return;

        setControls( { Regulator, Reverser, Brake, Whistle, Generator, Compressor } );
    }, [ Regulator, Reverser, Brake, Whistle, Generator, Compressor, isVisible ] );

    return (
        <MapPageLayout style={{ overflowY: 'auto', marginLeft: '5px', marginRight: '5px' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginTop: '50px', marginBottom: '50px' }}>
                <table style={{ width: '100%' }} className='frameControls'>
                    <thead>
                        <tr>
                            <th style={{ width: '16%' }}>Regulator</th>
                            <th style={{ width: '16%' }}>Reverser</th>
                            <th style={{ width: '16%' }}>Brake</th>
                            <th style={{ width: '16%' }}>Whistle</th>
                            <th style={{ width: '16%' }}>Generator</th>
                            <th style={{ width: '16%' }}>Compressor</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><Slider
                            vertical
                            min={0}
                            max={100}
                            value={controls.Regulator * 100}
                            step={1}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => setControls( { ...controls, Regulator: value / 100 } )}
                            onAfterChange={( value: number ) => actions.setEngineControls( frameId, EngineControls.REGULATOR, value / 100 )}
                        /></td>
                        <td><Slider
                            vertical
                            min={-100}
                            max={100}
                            value={controls.Reverser * 100}
                            step={1}
                            included={false}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                [ -100 ]: '-100%',
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => setControls( { ...controls, Reverser: value / 100 } )}
                            onAfterChange={( value: number ) => actions.setEngineControls( frameId, EngineControls.REVERSER, value / 100 )}
                        /></td>
                        <td><Slider
                            vertical
                            min={0}
                            max={100}
                            value={controls.Brake * 100}
                            step={1}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => setControls( { ...controls, Brake: value / 100 } )}
                            onAfterChange={( value: number ) => actions.setEngineControls( frameId, EngineControls.BRAKE, value / 100 )}
                        /></td>
                        <td><Slider
                            vertical
                            min={0}
                            max={100}
                            value={controls.Whistle * 100}
                            step={1}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => {
                                setWhistle( value );
                                setControls( { ...controls, Whistle: value / 100 } )
                            }}
                            onAfterChange={() => {
                                setWhistle( 0 );
                                setControls( { ...controls, Whistle: 0 } )
                            }}
                        /></td>
                        <td><Slider
                            vertical
                            min={0}
                            max={100}
                            value={controls.Generator * 100}
                            step={1}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => setControls( { ...controls, Generator: value / 100 } )}
                            onAfterChange={( value: number ) => actions.setEngineControls( frameId, EngineControls.GENERATOR, value / 100 )}
                        /></td>
                        <td><Slider
                            vertical
                            min={0}
                            max={100}
                            value={controls.Compressor * 100}
                            step={1}
                            tipFormatter={( value ) => value + '%'}
                            tooltipPlacement={'left'}
                            disabled={!controlEnabled}
                            marks={{
                                0: '0%',
                                100: '100%'
                            }}
                            style={{ height: 200, margin: '20px auto' }}
                            onChange={( value: number ) => setControls( { ...controls, Compressor: value / 100 } )}
                            onAfterChange={( value: number ) => actions.setEngineControls( frameId, EngineControls.COMPRESSOR, value / 100 )}
                        /></td>
                    </tr>
                    </tbody>
                </table>
                <table style={{ width: '100%' }}>
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
                        <td style={{ textAlign: 'center' }}>{BoilerPressure?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{FuelAmount?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{FireTemperature?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{WaterTemperature?.toFixed( 0 )}</td>
                    </tr>
                    </tbody>
                </table>
                <table style={{ width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Brake Pressure</th>
                        <th style={{ width: '25%' }}>Water Level</th>
                        <th style={{ width: '25%' }}>Current Speed</th>
                        <th style={{ width: '25%' }}>Max Speed</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{AirPressure?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{WaterLevel?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 )?.toFixed( 0 )}</td>
                    </tr>
                    </tbody>
                </table>
                <table style={{ width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={{ width: '50%' }}>Current Speed</th>
                        <th style={{ width: '50%' }}>Max Speed</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 ).toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 ).toFixed( 0 )}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </MapPageLayout>
    );

}