import React, { useState } from 'react';
import { Spin, Button, notification } from 'antd';

let failedCount = 0;

window.ipc.on( 'dangling-injector', ( event, state: 'DETECTED' | 'KILLED' | 'ERROR' ) => {
    if( state === 'DETECTED' )
        notification.warn( {
            message: 'Running Injector',
            key: 'dangling-injector',
            description: 'A running injector has been detected, that was not properly stopped. This process needs to be stopped, before you attach to the game.',
            btn: <DanglingInjectorButton>
                Stop Injector
            </DanglingInjectorButton>,
            placement: 'bottomRight',
            duration: 0,
        } );
    else if( state === 'KILLED' ) {
        notification.close( 'dangling-injector' );
        notification.success( {
            message: 'Injector Stopped',
            description: 'The injector was stopped succesfully.',
            placement: 'bottomRight',
        } );
    } else if( state === 'ERROR' ) {
        failedCount++;
        notification.close( 'dangling-injector' );
        notification.warn( {
            message: 'Failed to stop Injector',
            key: 'dangling-injector',
            description: 'Stopping the injector has failed.',
            btn: <DanglingInjectorButton key={failedCount}>
                Retry
            </DanglingInjectorButton>,
            placement: 'bottomRight',
            duration: 0,
        } );
    }
} );

function DanglingInjectorButton( { children }: { children: React.ReactNode }) {
    const [ loading, setLoading ] = useState( false );
    return <Spin spinning={loading}>
        <Button type="primary" onClick={() => {
            setLoading( true );
            window.ipc.send( 'kill-dangling-injector' );
        }}>
            {children}
        </Button>
    </Spin>
}