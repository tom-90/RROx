import { AttachedState } from "@rrox/types";
import { message, Modal, notification } from "antd";
import React, { createContext, useEffect, useState } from "react";

export const AttachContext = createContext<{
    status       ?: AttachedState,
    progress     ?: number,
    mode          : 'host' | 'client',
    shareURL     ?: string;
    shared       ?: boolean;
    loading       : boolean;
    setMode       : ( mode: 'host' | 'client', shared: boolean, url?: string ) => void,
    setShareURL   : ( url: string ) => void,
    setShared     : ( shared: boolean ) => void,
    attach        : () => void,
    detach        : () => void,
}>( null );

export function AttachProvider( { children }: { children?: React.ReactNode }) {
    const [ loading, setLoading ] = useState( false );
    const [ { status, progress }, setStatus ] = useState<{ status?: AttachedState, progress?: number }>( {} );
    const [ mode, setMode ] = useState<'host' | 'client'>( 'host' );
    const [ shareURL, setShareURL ] = useState<string>( null );
    const [ shared, setShared ] = useState( false );

    useEffect( () => {
        let currentStatus = status;
        const setAttached = (
            event: Electron.IpcRendererEvent,
            status: AttachedState,
            progress?: number,
            error?: string
        ) => {
            setStatus( { status, progress } );
            if( status === AttachedState.DETACHED && currentStatus === AttachedState.ATTACHING ) {
                if( !error )
                    notification.warn( {
                        message: 'Attaching failed',
                        description: 'Make sure your antivirus is not blocking the program and that the game is running.',
                        placement: 'bottomRight'
                    } );
                else {
                    Modal.error( {
                        title: 'Attaching failed',
                        content: <p>
                            Attaching has failed with the following error code:
                            <code style={{
                                display: 'block',
                                textAlign: 'center',
                                margin: '5px 0',
                                fontWeight: 'bold'
                            }}>{error}</code>
                            Details on how to fix this code can be found here:
                            <br/>
                            <a onClick={() => window.openBrowser( 'https://tom-90.github.io/RROx/error-codes' )}>https://tom-90.github.io/RROx/error-codes</a>
                        </p>,
                    } );
                }
            }
            currentStatus = status;
        };

        let cleanup = window.ipc.on( 'get-attached-state', setAttached );
        window.ipc.invoke( 'get-attached-state' ).then( ( status ) => setStatus( { status } ) );

        
        window.ipc.invoke( 'get-socket-state' ).then( ( { active, mode, shareURL }: { active: boolean, mode?: 'host'|'client', shareURL?: string } ) => {
            if( active ) {
                setShared( true );
                setMode( mode );
                setShareURL( shareURL );

                if( mode === 'client' )
                    setStatus( { status: AttachedState.ATTACHED } );
            } else
                setShared( false );
        } );

        return () => {
            cleanup();
        }
    }, [] );

    const handleError = ( e: any ) => {
        let msg = 'Unknown error';
        if( typeof e?.message === 'string' ) 
            msg = e?.message.replace( `Error invoking remote method 'set-socket-state': `, '' );

        message.error( `Error while connecting: ${msg}` );
        console.log( e );
        setLoading( false );
    };

    return <AttachContext.Provider
        value={{
            mode,
            loading,
            setMode,
            setShareURL,
            setShared,
            status,
            shared,
            progress,
            shareURL,
            attach: () => {
                if( mode === 'host' ) {
                    if( shared ) {
                        setLoading( true );
                        window.ipc.invoke( 'set-socket-state', 'host' )
                            .then( ( url: string ) => {
                                setShareURL( url );
                                window.ipc.send( 'set-attached-state', 'ATTACH' );
                                setLoading( false );
                            } ).catch( handleError );
                    } else {
                        setLoading( true );
                        window.ipc.invoke( 'set-socket-state', false )
                            .then( () => {
                                setShareURL( null );
                                window.ipc.send( 'set-attached-state', 'ATTACH' );
                                setLoading( false );
                            } ).catch( handleError );
                    }
                }
                
                if( mode === 'client' ) {
                    setLoading( true );
                    window.ipc.invoke( 'set-socket-state', 'client', shareURL )
                        .then( ( url: string ) => {
                            setLoading( false );
                            setShareURL( url );
                            setStatus( { status: AttachedState.ATTACHED } );
                        } ).catch( handleError );
                }
            },
            detach: () => {
                setLoading( true );
                window.ipc.send( 'set-attached-state', 'DETACH' );
                window.ipc.invoke( 'set-socket-state', false )
                        .then( () => {
                            setLoading( false );
                            setShareURL( null );
                            setStatus( { status: AttachedState.DETACHED } );
                        } ).catch( handleError );
            },
        }}
    >
        {children}
    </AttachContext.Provider>

}