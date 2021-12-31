import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Slider, Button } from "antd";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import { Frame } from '../../../../shared/data';
import { DraggableModal } from 'ant-design-draggable-modal';
import { EngineControls } from '../../../../shared/controls';
import { MapContext } from '../context';

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
    className,
    title,
    data,
    id,
    isVisible,
    isEngine,
    onClose,
    controlEnabled
}: {
    className?: string,
    title: string,
    data: Frame,
    id: number,
    isVisible: boolean,
    isEngine: boolean,
    onClose: () => void, controlEnabled: boolean
} ) {
    const { actions } = useContext( MapContext );

    const { Regulator, Reverser, Brake, Whistle, Generator, Compressor, BoilerPressure, WaterTemperature, FireTemperature, FuelAmount, AirPressure, WaterLevel, Speed, MaxSpeed } = data;

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
            actions.setEngineControls( id, EngineControls.WHISTLE, value / 100 );
        }, 100 );
    }, [ actions.setEngineControls, id ] );

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

    return <DraggableModal
        title={<>
            {title}
            {isEngine && <Button
                type='text'
                style={{ marginLeft: 10, padding: 5 }}
                onClick={() => setCompact( !compact )}
            >
                {compact ? <ExpandOutlined /> : <CompressOutlined />}
            </Button>}
        </>}
        visible={isVisible}
        className={className}
        footer={null}
        onCancel={onClose}
        initialWidth={800}
        initialHeight={450}
        zIndex={2000}
        modalRender={( content ) => {
            if ( !React.isValidElement( content ) )
                return;
            return React.cloneElement( content, {
                onClick: ( e: React.SyntheticEvent ) => {
                    e.stopPropagation();
                }
            } );
        }}
    >
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
                        onAfterChange={( value: number ) => actions.setEngineControls( id, EngineControls.REGULATOR, value / 100 )}
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
                        onAfterChange={( value: number ) => actions.setEngineControls( id, EngineControls.REVERSER, value / 100 )}
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
                        onAfterChange={( value: number ) => actions.setEngineControls( id, EngineControls.BRAKE, value / 100 )}
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
                        onAfterChange={( value: number ) => actions.setEngineControls( id, EngineControls.GENERATOR, value / 100 )}
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
                        onAfterChange={( value: number ) => actions.setEngineControls( id, EngineControls.COMPRESSOR, value / 100 )}
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
                    <td style={{ textAlign: 'center' }}>{BoilerPressure.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{FuelAmount.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{FireTemperature.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{WaterTemperature.toFixed( 0 )}</td>
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
                    <td style={{ textAlign: 'center' }}>{AirPressure.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{WaterLevel.toFixed( 0 )}</td>
                    <td style={{ textAlign: 'center' }}>{( Speed * 2.236936 ).toFixed( 1 )}</td>
                    <td style={{ textAlign: 'center' }}>{( MaxSpeed * 2.236936 ).toFixed( 0 )}</td>
                </tr>
            </tbody>
        </table>}
        {( !isEngine || compact ) && <table style={{ width: '100%' }}>
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
        </table>}
    </DraggableModal>;
}