import React, { createContext, useContext, useEffect, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { EventEmitter2 } from "eventemitter2";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

class SocketHelper extends EventEmitter2 {

    public key?: string = null;

    constructor( public readonly connection: Socket ) {
        super();

        this.connection.on( 'broadcast', ( channel: string, args: any[] ) => {
            this.emit( channel, ...args );
        } );

        this.connection.on( 'connect_error', ( error ) => {
            console.log('Socket connect error', error);
        });

        this.connection.on( 'disconnect', ( reason ) => {
            console.log('Socket disconnected. Reason:', reason);

            // If we were joined, then we emit the leave event
            if( this.key ) {
                this.key = null;
                this.emit( 'leave' );
            }

            this.connect();
        } );

        this.connect();
    }

    public invoke<T = any>( type: string, ...args: any[] ): Promise<T> {
        return new Promise( ( resolve, reject ) => {
            const invoke = () => {
                this.connection.emit( 'rpc', type, args, ( res: T ) => resolve( res ) );
            };

            // If we have not joined yet, we will wait for the join (with 5 sec timeout)before invoking
            if( !this.key )
                this.waitFor( 'join', 5000 )
                    .then( () => {
                        invoke();
                    } ).catch( () => {
                        reject( 'Not joined' );
                    } );
            else
                invoke();
        } );
    }
    
    public send( type: string, ...args: any[] ) {
        const send = () => {
            this.connection.emit( 'rpc', type, args );
        };

        // If we have not joined yet, we will wait for the join (with 5 sec timeout)before invoking
        if( !this.key )
            this.waitFor( 'join', 5000 )
                .then( () => {
                    send()
                } ).catch( () => {
                    console.error( `Cannot send socket message '${type}', because the socket has not joined a session.` );
                } );
        else
            send();
    }

    public join( key: string ): Promise<void> {
        // If we have already joined with the same key, we do not need to do anything
        if( this.key === key )
            return Promise.resolve();

        // If we have already joined with a different key, we first need to leave to rejoin
        if( this.key ) {
            this.leave();
        }

        return new Promise<void>( ( resolve, reject ) => {
            this.connection.emit( 'join', key, ( success: boolean ) => {
                if( !success )
                    return reject( 'Key is invalid' );

                this.key = key;

                this.emit( 'join' );

                resolve();
            } );
        } );
    }

    public leave() {
        this.disconnect();
    }

    public connect() {
        this.connection.connect();
    }

    public disconnect() {
        this.connection.disconnect();
    }

}

export const SocketContext = createContext<SocketHelper>( null );

/**
 * Retrieve the socket.io socket
 */
export function useSocket() {
    const context = useContext( SocketContext );

    return context;
}

/**
 * Retrieve the socket.io socket using the join-key provided in the arguments
 *
 * @param key 
 */
export function useSocketSession( key: string ) {
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect( () => {
        console.log( 'joining', key );
        socket.join( key ).then( () => {
            console.log( 'Connected to socket with key', key );
        } ).catch( ( e ) => {
            console.log( 'Connection to socket failed for key', key, e );
            message.error( 'Key is invalid' );
            navigate( '/' );
        } );

        const onLeave = () => {
            message.error( 'Disconnected from host' );
            navigate( '/' );
        };

        // When the socket disconnects (e.g. host detaches), redirect to homepage
        socket.on( 'leave', onLeave );

        // Remove listeners when component disappears
        return () => {
            socket.removeListener( 'leave', onLeave );
        };
    }, [ socket, key ] );

    return socket;
}

export function SocketProvider( { children }: { children?: React.ReactNode } ) {
    const socket = useMemo( () => {
        return io( "https://rrox.tom90.nl", {
            transports: [ 'websocket' ],
            autoConnect: false
        } );
    }, [] );

    const helper = useMemo( () => new SocketHelper( socket ), [ socket ] );

    return <SocketContext.Provider
        value={helper}
    >
        {children}
    </SocketContext.Provider>;
}