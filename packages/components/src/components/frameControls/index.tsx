import React, { useState, useEffect, useMemo } from 'react';
import { Slider, Switch, Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Frame } from '@rrox/types';
import { EngineControls } from '@rrox/types';
import { CouplingsBar } from './couplingsBar';
import { FrameDefinitions } from '../../mapLeaflet';
import { getCoupledFrames, isEngine as checkIsEngine } from '@rrox/utils';

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

export function FrameControls( {
    data,
    frames,
    compact = false,
    controlEnabled = true,
    setEngineControls,
    setControlsSynced
}: {
    data: Frame,
    frames: Frame[],
    compact?: boolean,
    controlEnabled?: boolean,
    setEngineControls: ( ID: number, type: EngineControls, value: number ) => void,
    setControlsSynced: ( ID: number, enabled: boolean ) => void,
} ) {
    const [ selectedFrame, setSelectedFrame ] = useState( data.ID );

    const selectedData = frames.find( ( f ) => f.ID === selectedFrame );

    const {
        Regulator, Reverser, Brake, Whistle, Generator, Compressor, MaxBoilerPressure, MaxWaterLevel,
        BoilerPressure, WaterTemperature, FireTemperature, FuelAmount, MaxFuelAmount,
        AirPressure, WaterLevel, Speed, MaxSpeed, Type, SyncControls, Tender
    } = selectedData || {};

    const definition = FrameDefinitions[ Type ];
    const isEngine = definition.engine;

    const [ pendingSyncControls, setPendingSyncControls ] = useState<boolean | null>( null );

    useEffect( () => {
        if( pendingSyncControls !== null && pendingSyncControls === SyncControls )
        setPendingSyncControls( null );
    }, [ pendingSyncControls, SyncControls ] );

    const [ controls, setControls ] = useState<{
        Regulator: number,
        Reverser: number,
        Brake: number,
        Whistle: number,
        Generator: number,
        Compressor: number
    }>( { Regulator, Reverser, Brake, Whistle, Generator, Compressor } );

    const setWhistle = useMemo( () => {
        return throttle( ( value: number ) => {
            setEngineControls( selectedFrame, EngineControls.WHISTLE, value / 100 );
        }, 100 );
    }, [ setEngineControls, selectedFrame ] );

    useEffect( () => {
        if ( controls.Regulator === Regulator
                && controls.Reverser === Reverser
                && controls.Brake === Brake
                && controls.Whistle === Whistle
                && controls.Generator === Generator
                && controls.Compressor === Compressor )
            return;

        setControls( { Regulator, Reverser, Brake, Whistle, Generator, Compressor } );
    }, [ Regulator, Reverser, Brake, Whistle, Generator, Compressor ] );

    const coupledFrames = getCoupledFrames( selectedData, frames );
    const controlledBy = checkIsEngine( selectedData ) ? coupledFrames.find(
        ( coupled ) => coupled.isCoupled && coupled.frame.SyncControls && checkIsEngine( coupled.frame ) && coupled.frame !== selectedData
    )?.frame : undefined;

    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
            {controlledBy
                ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 250 }}>
                    Controlled by&nbsp;<strong>{`${controlledBy.Name.replace("<br>", "").toUpperCase()}${controlledBy.Name && controlledBy.Number ? ' - ' : ''}${controlledBy.Number.toUpperCase() || ''}`}</strong>
                </div>
                : <table style={{ width: '100%' }} className='frameControls'>
                        <thead>
                            {isEngine
                                ? <tr>
                                    <th style={{ width: '16%' }}>Regulator</th>
                                    <th style={{ width: '16%' }}>Reverser</th>
                                    <th style={{ width: '16%' }}>Brake</th>
                                    {!compact && <th style={{ width: '16%' }}>Whistle</th>}
                                    {!compact && <th style={{ width: '16%' }}>Generator</th>}
                                    {!compact && <th style={{ width: '16%' }}>Compressor</th>}
                                </tr>
                                : <tr><th style={{ width: '100%' }}>Brake</th></tr>
                            }
                        </thead>
                        <tbody>
                            <tr>
                                {isEngine && <td><Slider
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
                                    onAfterChange={( value: number ) => setEngineControls( selectedFrame, EngineControls.REGULATOR, value / 100 )}
                                /></td>}
                                {isEngine && <td><Slider
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
                                    onAfterChange={( value: number ) => setEngineControls( selectedFrame, EngineControls.REVERSER, value / 100 )}
                                /></td>}
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
                                    onAfterChange={( value: number ) => setEngineControls( selectedFrame, EngineControls.BRAKE, value / 100 )}
                                /></td>
                                {isEngine && !compact && <td><Slider
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
                                /></td>}
                                {isEngine && !compact && <td><Slider
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
                                    onAfterChange={( value: number ) => setEngineControls( selectedFrame, EngineControls.GENERATOR, value / 100 )}
                                /></td>}
                                {isEngine && !compact && <td><Slider
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
                                    onAfterChange={( value: number ) => setEngineControls( selectedFrame, EngineControls.COMPRESSOR, value / 100 )}
                                /></td>}
                            </tr>
                        </tbody>
                    </table>}
            {isEngine && !compact && <div style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                <Switch
                    checked={SyncControls}
                    onChange={( checked ) => {
                        setControlsSynced( selectedFrame, checked );
                        setPendingSyncControls( checked );
                    }}
                    style={{ marginRight: 10 }}
                    loading={pendingSyncControls != null && pendingSyncControls !== SyncControls}
                />
                Synchronize controls with other engines.
                <Popover content={<p style={{ maxWidth: 375 }}>
                    By enabling this setting, the controls of this engine will be synchronized to all other coupled engines.
                    This works when controlling the engine in-game as well as from RROx. (Only regulator, reverser and brake are synchronized)
                </p>} trigger="hover" zIndex={2500}>
                    <QuestionCircleOutlined style={{ fontSize: 20, margin: '0 10px', color: '#f98c16', cursor: 'pointer' }} />
                </Popover>
            </div>}
            {isEngine && !compact && <table style={{ width: '100%' }}>
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
                        <td style={{ textAlign: 'center' }}>{BoilerPressure?.toFixed( 0 )} / {MaxBoilerPressure?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{FuelAmount?.toFixed( 0 )} / {MaxFuelAmount?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{FireTemperature?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{WaterTemperature?.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
            {isEngine && !compact && <table style={{ width: '100%' }}>
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
                        <td style={{ textAlign: 'center' }}>{WaterLevel?.toFixed( 0 )} / {MaxWaterLevel?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 )?.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
            {( ( !isEngine && !definition.tender ) || compact ) && <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50%' }}>Current Speed</th>
                        <th style={{ width: '50%' }}>Max Speed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 )?.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
            {( definition.tender && !compact ) && <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Current Speed</th>
                        <th style={{ width: '25%' }}>Max Speed</th>
                        <th style={{ width: '25%' }}>Water Level</th>
                        <th style={{ width: '25%' }}>Firewood Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 )?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{Tender?.WaterLevel?.toFixed( 0 )} / {Tender?.MaxWaterLevel?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{Tender?.FuelAmount?.toFixed( 0 )} / {Tender?.MaxFuelAmount?.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
        </div>
        {!compact && <CouplingsBar
            coupledFrames={getCoupledFrames( data, frames )}
            selectedID={selectedFrame}
            setSelectedID={setSelectedFrame}
        />}
    </div>;
}