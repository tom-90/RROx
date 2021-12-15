import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Slider } from "antd";
import { Frame } from '../../../shared/data';
import { EngineControls } from '../../../shared/controls';

function throttle<P extends any[]>( fn: ( ...args: P ) => void, wait: number ): ( ...args: P ) => void {
    let latestArgs: P;
    let timeout: NodeJS.Timeout = null;
    return function ( ...args: P ) {
        if( timeout !== null ) {
            latestArgs = args;
        } else {
            timeout = setTimeout( () => {
                if( latestArgs )
                    fn( ...latestArgs );
                clearTimeout( timeout );
                timeout = null;
                latestArgs = null;
            }, wait );
            fn( ...args );
        }
    }
}

export function FrameControls( { title, data, id, isVisible, onClose, controlEnabled }: { title: string, data: Frame, id: number, isVisible: boolean, onClose: () => void, controlEnabled: boolean } ) {
    const { Regulator, Reverser, Brake, Whistle, Generator, Compressor, BoilerPressure, WaterTemperature, FireTemperature, FuelAmount, AirPressure, WaterLevel, Speed, MaxSpeed } = data;
    
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
            window.ipc.send( 'set-engine-controls', id, EngineControls.WHISTLE, value / 100 )
        }, 100 );
    }, [] );

    useEffect( () => {
        if( !isVisible ||
                ( controls.Regulator === Regulator
                && controls.Reverser === Reverser
                && controls.Brake === Brake
                && controls.Whistle === Whistle
                && controls.Generator === Generator
                && controls.Compressor === Compressor ) )
            return;

        setControls( { Regulator, Reverser, Brake, Whistle, Generator, Compressor } );
    }, [ Regulator, Reverser, Brake, Whistle, Generator, Compressor, isVisible ] );

    return <Modal
        title={title}
        visible={isVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose={true}
        width={800}
    >
        <table style={{ width: '100%'}}>
            <thead>
                <tr>
                    <th style={{ width: '16%'}}>Regulator</th>
                    <th style={{ width: '16%'}}>Reverser</th>
                    <th style={{ width: '16%'}}>Brake</th>
                    <th style={{ width: '16%'}}>Whistle</th>
                    <th style={{ width: '16%'}}>Generator</th>
                    <th style={{ width: '16%'}}>Compressor</th>
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
                        tooltipVisible={isVisible}
                        disabled={!controlEnabled}
                        marks={{
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={( value: number ) => setControls( { ...controls, Regulator: value / 100 } )}
                        onAfterChange={( value: number ) => window.ipc.send( 'set-engine-controls', id, EngineControls.REGULATOR, value / 100 )}
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
                        tooltipVisible={isVisible}
                        disabled={!controlEnabled}
                        marks={{
                            [ -100 ]: '-100%',
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={( value: number ) => setControls( { ...controls, Reverser: value / 100 } )}
                        onAfterChange={( value: number ) => window.ipc.send( 'set-engine-controls', id, EngineControls.REVERSER, value / 100 )}
                    /></td>
                    <td><Slider 
                        vertical
                        min={0}
                        max={100}
                        value={controls.Brake * 100}
                        step={1}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
                        disabled={!controlEnabled}
                        marks={{
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={( value: number ) => setControls( { ...controls, Brake: value / 100 } )}
                        onAfterChange={( value: number ) => window.ipc.send( 'set-engine-controls', id, EngineControls.BRAKE, value / 100 )}
                    /></td>
                    <td><Slider 
                        vertical
                        min={0}
                        max={100}
                        value={controls.Whistle * 100}
                        step={1}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
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
                        tooltipVisible={isVisible}
                        disabled={!controlEnabled}
                        marks={{
                            [ -100 ]: '-100%',
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={( value: number ) => setControls( { ...controls, Generator: value / 100 } )}
                        onAfterChange={( value: number ) => window.ipc.send( 'set-engine-controls', id, EngineControls.GENERATOR, value / 100 )}
                    /></td>
                    <td><Slider 
                        vertical
                        min={0}
                        max={100}
                        value={controls.Compressor * 100}
                        step={1}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
                        disabled={!controlEnabled}
                        marks={{
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={( value: number ) => setControls( { ...controls, Compressor: value / 100 } )}
                        onAfterChange={( value: number ) => window.ipc.send( 'set-engine-controls', id, EngineControls.COMPRESSOR, value / 100 )}
                    /></td>
                </tr>
            </tbody>
        </table>
        <table style={{ width: '100%'}}>
            <thead>
                <tr>
                    <th style={{ width: '25%'}}>Boiler Pressure</th>
                    <th style={{ width: '25%'}}>Fuel Amount</th>
                    <th style={{ width: '25%'}}>Fire Temp.</th>
                    <th style={{ width: '25%'}}>Water Temp.</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ textAlign: 'center' }}>{BoilerPressure.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{FuelAmount.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{FireTemperature.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{WaterTemperature.toFixed( 0 )}</td>
                </tr>
            </tbody>
        </table>
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '25%'}}>Brake Pressure</th>
                    <th style={{ width: '25%'}}>Water Level</th>
                    <th style={{ width: '25%'}}>Current Speed</th>
                    <th style={{ width: '25%'}}>Max Speed</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ textAlign: 'center' }}>{AirPressure.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{WaterLevel.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 ).toFixed( 1 )}</td>
                    <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 ).toFixed( 0 )}</td>
                </tr>
            </tbody>
        </table>
    </Modal>;
}