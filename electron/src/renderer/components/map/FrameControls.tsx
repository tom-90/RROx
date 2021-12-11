import React, { useState, useEffect } from 'react';
import { Modal, Slider } from "antd";

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

const sendControls = throttle( ( data, id ) => {
    window.ipc.send( 'set-engine-controls', id, data.regulator, data.reverser, data.brake );
}, 500 );

export function FrameControls( { title, regulator, reverser, brake, id, isVisible, onClose }: { title: string, regulator: number, reverser: number, brake: number, id: number, isVisible: boolean, onClose: () => void } ) {
    const [ controls, setControls ] = useState<{ regulator?: number, reverser?: number, brake?: number, pendingUpdate?: boolean }>( { regulator, reverser, brake } );

    useEffect( () => {
        if( !isVisible || controls.pendingUpdate || ( controls.regulator === regulator && controls.reverser === reverser && controls.brake === brake ) )
            return;

        setControls( { regulator, reverser, brake } );
    }, [ regulator, reverser, brake, isVisible ] );

    const onThrottle = ( value: number ) => {
        let data = { regulator: value / 100, reverser: controls.reverser, brake: controls.brake, pendingUpdate: true };
        setControls( data );
        sendControls( data, id );
    };

    const onRegulator = ( value: number ) => {
        let data = { regulator: controls.regulator, reverser: value / 100, brake: controls.brake, pendingUpdate: true };
        setControls( data );
        sendControls( data, id );
    }

    const onBrake = ( value: number ) => {
        let data = { regulator: controls.regulator, reverser: controls.reverser, brake: value / 100, pendingUpdate: true };
        setControls( data );
        sendControls( data, id );
    };

    return <Modal
        title={title}
        visible={isVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose={true}
    >
        <table style={{ width: '100%'}}>
            <thead>
                <tr>
                    <th style={{ width: '33%'}}>Regulator</th>
                    <th style={{ width: '33%'}}>Reverser</th>
                    <th style={{ width: '33%'}}>Brake</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><Slider 
                        vertical
                        min={0}
                        max={100}
                        value={controls.regulator * 100}
                        step={1}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
                        marks={{
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={onThrottle}
                        onAfterChange={() => setControls( { ...controls, pendingUpdate: false } )}
                    /></td>
                    <td><Slider 
                        vertical
                        min={-100}
                        max={100}
                        value={controls.reverser * 100}
                        step={1}
                        included={false}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
                        marks={{
                            [ -100 ]: '-100%',
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={onRegulator}
                        onAfterChange={() => setControls( { ...controls, pendingUpdate: false } )}
                    /></td>
                    <td><Slider 
                        vertical
                        min={0}
                        max={100}
                        value={controls.brake * 100}
                        step={1}
                        tipFormatter={( value ) => value + '%'}
                        tooltipPlacement={'left'}
                        tooltipVisible={isVisible}
                        marks={{
                            0: '0%',
                            100: '100%'
                        }}
                        style={{ height: 200, margin: '20px auto' }}
                        onChange={onBrake}
                        onAfterChange={() => setControls( { ...controls, pendingUpdate: false } )}
                    /></td>
                </tr>
            </tbody>
        </table>
    </Modal>;
}