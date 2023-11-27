import React, { useState, useEffect, useMemo } from 'react';
import { Slider, Popover, Switch } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { FrameDefinitions } from '../../definitions';
import { FrameCarControl, IFrameCar, getCoupledFrames, SetControlsSyncCommunicator, isEngine as checkIsEngine, SetControlsCommunicator, FrameCarType } from '@rrox-plugins/world/shared';
import { CouplingsBar } from './couplingsBar';
import { useRPC } from '@rrox/api';

function throttle<P extends any[]>( fn: ( ...args: P ) => void, wait: number ): ( ...args: P ) => void {
    let latestArgs: P | null;
    let timeout: NodeJS.Timeout | null = null;
    return function ( ...args: P ) {
        if ( timeout !== null ) {
            latestArgs = args;
        } else {
            timeout = setTimeout( () => {
                if ( latestArgs )
                    fn( ...latestArgs );
                clearTimeout( timeout! );
                timeout = null;
                latestArgs = null;
            }, wait );
            fn( ...args );
        }
    }
}

export function FrameControls( {
    data,
    index,
    frames,
    compact = false,
    controlEnabled = true
}: {
    index: number,
    data: IFrameCar,
    frames: IFrameCar[],
    compact?: boolean,
    controlEnabled?: boolean
} ) {
    const [ selectedFrame, setSelectedFrame ] = useState( index );
    const setControlsSynced = useRPC( SetControlsSyncCommunicator );

    const selectedData = frames[ selectedFrame ];

    const { type, controls: controlsData, boiler, compressor, tender, speedMs, maxSpeedMs } = selectedData || {};

	/*
		Regarding the RROx speed conversion:
		-"44.704" converts from cm/s to mph.
		-"2.236936" converts from m/s to mph.
		
		Game Developers changed "speedMs" to give cm/s update to Game Build #0.6.0.0.3.
		--> "maxSpeedMs" still gives m/s in Game Build #0.6.0.0.3.
	*/

    const definition = FrameDefinitions[ type ] ?? FrameDefinitions[ FrameCarType.UNKNOWN ];
    const isEngine = definition.engine;

    const [ pendingSyncControls, setPendingSyncControls ] = useState<boolean | null>( null );

    useEffect( () => {
        if ( pendingSyncControls !== null && pendingSyncControls === data.syncedControls )
            setPendingSyncControls( null );
    }, [ pendingSyncControls, data.syncedControls ] );

    const [ controls, setControls ] = useState<{
        regulator?: number,
        reverser?: number,
        brake: number,
        whistle?: number,
        generator?: number,
        compressor?: number
    }>( controlsData );

    const setEngineControls = useRPC( SetControlsCommunicator );

    const setWhistle = useMemo( () => {
        return throttle( ( value: number ) => {
            setEngineControls( selectedFrame, FrameCarControl.Whistle, value / 100 );
        }, 100 );
    }, [ setEngineControls, selectedFrame ] );

    useEffect( () => {
        if ( controlsData.regulator === controls.regulator
            && controlsData.reverser === controls.reverser
            && controlsData.brake === controls.brake
            && controlsData.whistle === controls.whistle
            && controlsData.generator === controls.generator
            && controlsData.compressor === controls.compressor )
            return;

        setControls( controlsData );
    }, [ controlsData ] );

    const coupledFrames = getCoupledFrames( selectedData, selectedFrame, frames );
    const controlledBy = isEngine ? coupledFrames.find(
        ( coupled ) => coupled.isCoupled && coupled.frame.syncedControls && checkIsEngine( coupled.frame ) && coupled.frame !== selectedData
    )?.frame : undefined;

    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
            {controlledBy
                ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 250 }}>
                    Controlled by&nbsp;<strong>{`${controlledBy.name.replace( "<br>", "" ).toUpperCase()}${controlledBy.name && controlledBy.number ? ' - ' : ''}${controlledBy.number.toUpperCase() || ''}`}</strong>
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
                                value={controls.regulator! * 100}
                                step={1}
                                tipFormatter={( value ) => value + '%'}
                                tooltipPlacement={'left'}
                                disabled={!controlEnabled}
                                marks={{
                                    0: '0%',
                                    100: '100%'
                                }}
                                style={{ height: 200, margin: '20px auto' }}
                                onChange={( value: number ) => setControls( { ...controls, regulator: value / 100 } )}
                                onAfterChange={( value: number ) => setEngineControls( selectedFrame, FrameCarControl.Regulator, value / 100 )}
                            /></td>}
                            {isEngine && <td><Slider
                                vertical
                                min={-100}
                                max={100}
                                value={controls.reverser! * 100}
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
                                onChange={( value: number ) => setControls( { ...controls, reverser: value / 100 } )}
                                onAfterChange={( value: number ) => setEngineControls( selectedFrame, FrameCarControl.Reverser, value / 100 )}
                            /></td>}
                            <td><Slider
                                vertical
                                min={0}
                                max={100}
                                value={controls.brake * 100}
                                step={1}
                                tipFormatter={( value ) => value + '%'}
                                tooltipPlacement={'left'}
                                disabled={!controlEnabled}
                                marks={{
                                    0: '0%',
                                    100: '100%'
                                }}
                                style={{ height: 200, margin: '20px auto' }}
                                onChange={( value: number ) => setControls( { ...controls, brake: value / 100 } )}
                                onAfterChange={( value: number ) => setEngineControls( selectedFrame, FrameCarControl.Brake, value / 100 )}
                            /></td>
                            {isEngine && !compact && <td><Slider
                                vertical
                                min={0}
                                max={100}
                                value={controls.whistle! * 100}
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
                                    setControls( { ...controls, whistle: value / 100 } )
                                }}
                                onAfterChange={() => {
                                    setWhistle( 0 );
                                    setControls( { ...controls, whistle: 0 } )
                                }}
                            /></td>}
                            {isEngine && !compact && <td><Slider
                                vertical
                                min={0}
                                max={100}
                                value={( controls.generator || 0 ) * 100}
                                step={1}
                                tipFormatter={( value ) => value + '%'}
                                tooltipPlacement={'left'}
                                disabled={!controlEnabled}
                                marks={{
                                    0: '0%',
                                    100: '100%'
                                }}
                                style={{ height: 200, margin: '20px auto' }}
                                onChange={( value: number ) => setControls( { ...controls, generator: value / 100 } )}
                                onAfterChange={( value: number ) => setEngineControls( selectedFrame, FrameCarControl.Generator, value / 100 )}
                            /></td>}
                            {isEngine && !compact && <td><Slider
                                vertical
                                min={0}
                                max={100}
                                value={( controls.compressor || 0 ) * 100}
                                step={1}
                                tipFormatter={( value ) => value + '%'}
                                tooltipPlacement={'left'}
                                disabled={!controlEnabled}
                                marks={{
                                    0: '0%',
                                    100: '100%'
                                }}
                                style={{ height: 200, margin: '20px auto' }}
                                onChange={( value: number ) => setControls( { ...controls, compressor: value / 100 } )}
                                onAfterChange={( value: number ) => setEngineControls( selectedFrame, FrameCarControl.Compressor, value / 100 )}
                            /></td>}
                        </tr>
                    </tbody>
                </table>
            }
            {isEngine && !compact && controlEnabled && !controlledBy && <div style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
                <Switch
                    checked={selectedData.syncedControls}
                    onChange={( checked ) => {
                        setControlsSynced( selectedFrame, checked );
                        setPendingSyncControls( checked );
                    }}
                    style={{ marginRight: 10 }}
                    loading={pendingSyncControls != null && pendingSyncControls !== selectedData.syncedControls}
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
                        <td style={{ textAlign: 'center' }}>{boiler?.pressure.toFixed( 0 )} / {boiler?.maxPressure.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{boiler?.fuel.toFixed( 0 )} / {boiler?.maxFuel.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{boiler?.fireTemperature.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{boiler?.waterTemperature.toFixed( 0 )}</td>
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
                        <td style={{ textAlign: 'center' }}>{compressor?.airPressure.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{boiler?.waterAmount.toFixed( 0 )} / {boiler?.maxWaterAmount.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{( speedMs / 44.704 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( maxSpeedMs * 2.236936 )?.toFixed( 0 )}</td>
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
                        <td style={{ textAlign: 'center' }}>{( speedMs / 44.704 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( maxSpeedMs * 2.236936 )?.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
            {( definition.tender && !compact ) && <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Current Speed</th>
                        <th style={{ width: '25%' }}>Max Speed</th>
                        <th style={{ width: '25%' }}>Water Level</th>
                        <th style={{ width: '25%' }}>Fuel Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{( speedMs / 44.704 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( maxSpeedMs * 2.236936 )?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{tender?.water.toFixed( 0 )} / {tender?.maxWater.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{tender?.fuel.toFixed( 0 )} / {tender?.maxFuel.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
        </div>
        {!compact && <CouplingsBar
            coupledFrames={getCoupledFrames( data, index, frames )}
            selectedIndex={selectedFrame}
            setSelectedIndex={setSelectedFrame}
        />}
    </div>;
}