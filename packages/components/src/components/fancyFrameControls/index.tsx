import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Slider } from "antd";
import { Frame } from '@rrox/types';
import { EngineControls } from '@rrox/types';

import { Gauge, GuageType } from '@rrox/components/src/components/fancyFrameControls/controls/GaugeControl';
import { Sight } from '@rrox/components/src/components/fancyFrameControls/controls/SightControl';
import { CustomSlider } from '@rrox/components/src/components/fancyFrameControls/controls/SliderControl';
import { Whistle as WhistleControl } from '@rrox/components/src/components/fancyFrameControls/controls/WhistleControl';
import { WoodLevel } from '@rrox/components/src/components/fancyFrameControls/controls/WoodControl';

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

export function FancyFrameControls( {
    data,
    isEngine,
    compact = false,
    controlEnabled = true,
    setEngineControls
}: {
    data: Frame,
    isEngine: boolean,
    compact?: boolean,
    controlEnabled?: boolean,
    setEngineControls: ( type: EngineControls, value: number ) => void,
} ) {
    const { Regulator, Reverser, Brake, Whistle, Generator, Compressor, BoilerPressure, WaterTemperature, FireTemperature, FuelAmount, AirPressure, WaterLevel, Speed, MaxSpeed } = data || {};
    let FuelPercent = FuelAmount / 50 * 100;
    let WaterPercent = WaterLevel / 8000 * 100;

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
            setEngineControls( EngineControls.WHISTLE, value / 100 );
        }, 100 );
    }, [ setEngineControls ] );

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

    return <>

        {isEngine && !compact && <table style={{ width: '100%' }}>
            <tbody>
            <tr>
                <td>
                    <Gauge
                        type={GuageType.SPEED}
                        size={200}
                        value={Math.round(Speed * 2.236936)}
                        max={Math.round(MaxSpeed * 2.236936)}
                    />
                </td>
                <td>
                    <WoodLevel
                        percentage={FuelPercent}
                        size={200}
                    />
                </td>
                {isEngine && !compact && <td>
                    <WhistleControl
                        onChange={( value: number ) => {
                            setWhistle( value );
                            setControls( { ...controls, Whistle: value / 100 } )
                        }}
                    />
                </td>}
            </tr>
            </tbody>
        </table>}

        {isEngine && !compact && <table style={{ width: '100%' }}>
            <tbody>
                <tr>
                    <td>
                        <Gauge
                            type={GuageType.BOILER_PRESSUERE}
                            value={BoilerPressure}
                            size={200}
                        />
                    </td>
                    <td>
                        <Gauge
                            type={GuageType.FIRE_TEMPRATURE}
                            value={FireTemperature}
                            size={200}
                        />
                    </td>
                    <td>
                        <Gauge
                            type={GuageType.WATER_TEMPRATURE}
                            value={WaterTemperature}
                            size={200}
                        />
                    </td>
                    <td>
                        <Gauge
                            type={GuageType.BRAKE_PRESSUERE}
                            value={AirPressure}
                            size={200}
                        />
                    </td>
                </tr>
            </tbody>
        </table>}

        <table style={{ width: '100%' }} className='frameControls'>
            <tbody>
            <tr>
                {isEngine && <td>
                    <CustomSlider
                        value={controls.Regulator * 100}
                        disabled={!controlEnabled}
                        onChange={( value: number ) => setControls( { ...controls, Regulator: value / 100 } )}
                        onAfterChange={( value: number ) => setEngineControls( EngineControls.REGULATOR, value / 100 )}
                        text="Regulator"
                    />
                </td>}
                {isEngine && <td>
                    <CustomSlider
                        value={controls.Reverser * 100}
                        disabled={!controlEnabled}
                        min={-100}
                        max={100}
                        onChange={( value: number ) => setControls( { ...controls, Reverser: value / 100 } )}
                        onAfterChange={( value: number ) => setEngineControls( EngineControls.REVERSER, value / 100 )}
                        text="Reverser"
                    />
                </td>}
                <td>
                    <CustomSlider
                        value={controls.Brake * 100}
                        disabled={!controlEnabled}
                        onChange={( value: number ) => setControls( { ...controls, Brake: value / 100 } )}
                        onAfterChange={( value: number ) => setEngineControls( EngineControls.BRAKE, value / 100 )}
                        text="Brake"
                    />
                </td>
                {isEngine && !compact && <td>
                    <CustomSlider
                        value={controls.Generator * 100}
                        disabled={!controlEnabled}
                        onChange={( value: number ) => setControls( { ...controls, Generator: value / 100 } )}
                        onAfterChange={( value: number ) => setEngineControls( EngineControls.GENERATOR, value / 100 )}
                        text="Generator"
                    />
                </td>}
                {isEngine && !compact && <td>
                    <CustomSlider
                        value={controls.Compressor * 100}
                        disabled={!controlEnabled}
                        onChange={( value: number ) => setControls( { ...controls, Compressor: value / 100 } )}
                        onAfterChange={( value: number ) => setEngineControls( EngineControls.COMPRESSOR, value / 100 )}
                        text="Compressor"
                    />
                </td>}
                {isEngine && !compact && <td>
                    <Sight
                        percentage={WaterPercent}
                        size={100}
                    />
                </td>}
            </tr>
            </tbody>
        </table>
    </>;
}