import React, { useState, useEffect, useMemo } from 'react';
import { Slider } from "antd";
import { FrameDefinitions } from '../../definitions';
import { FrameCarControl, IFrameCar } from '@rrox/world/shared';

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
    controlEnabled = true,
    setEngineControls
}: {
    index: number,
    data: IFrameCar,
    frames: IFrameCar[],
    compact?: boolean,
    controlEnabled?: boolean,
    setEngineControls: ( index: number, type: FrameCarControl, value: number ) => void,
} ) {
    const [ selectedFrame, setSelectedFrame ] = useState( index );

    const selectedData = frames[ selectedFrame ];

    const { type, controls: controlsData, boiler, compressor, tender, speedMs, maxSpeedMs } = selectedData || {};

    const definition = FrameDefinitions[ type ];
    const isEngine = definition.engine;

    const [ controls, setControls ] = useState<{
        regulator?: number,
        reverser?: number,
        brake: number,
        whistle?: number,
        generator?: number,
        compressor?: number
    }>( controlsData );

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

    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
            <table style={{ width: '100%' }} className='frameControls'>
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
                            value={(controls.generator || 0) * 100}
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
                            value={(controls.compressor || 0) * 100}
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
                        <td style={{ textAlign: 'center' }}>{tender?.water.toFixed( 0 )} / {tender?.maxWater.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{( speedMs * 2.236936 )?.toFixed( 1 )}</td>
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
                        <td style={{ textAlign: 'center' }}>{( speedMs * 2.236936 )?.toFixed( 1 )}</td>
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
                        <th style={{ width: '25%' }}>Firewood Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center' }}>{( speedMs * 2.236936 )?.toFixed( 1 )}</td>
                        <td style={{ textAlign: 'center' }}>{( maxSpeedMs * 2.236936 )?.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{tender?.water.toFixed( 0 )} / {tender?.maxWater.toFixed( 0 )}</td>
                        <td style={{ textAlign: 'center' }}>{tender?.fuel.toFixed( 0 )} / {tender?.maxFuel.toFixed( 0 )}</td>
                    </tr>
                </tbody>
            </table>}
        </div>
    </div>;
}