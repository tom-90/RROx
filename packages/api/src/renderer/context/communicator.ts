import { useEffect, useContext, useRef, useCallback, useState } from "react";
import { Diff } from "deep-diff";
import { CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType } from "../../shared";
import { RendererCommunicator } from "../communicator";
import { getContext } from "./internal";
import { applyDiff } from "../utils";
import { EventEmitter2 } from "eventemitter2";

export type CommunicatorContext = RendererCommunicator | null;

/**
 * Registers a listener for a specific communicator.
 * The listener will receive events sent by a controller for the communicator.
 * The listener will automatically be deregistered when the React component unmounts.
 * 
 * @param communicator Communicator to activate the listener for
 * @param listener Listener that should be called for each received event
 */
export function useListener<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
    communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void
): void {
    const context = useContext( getContext( "communicator" ) );

    const savedListener = useRef<( ...args: CommunicatorEventParameters<C> ) => void>();

    useEffect( () => {
        savedListener.current = listener;
    }, [ listener ] );

    useEffect( () => {
        if( !context )
            return;

        const listener = ( ...args: CommunicatorEventParameters<C> ) => savedListener.current!( ...args );

        const destroy = context.listen( communicator, listener );

        return () => {
            destroy();
        };
    }, [ context, communicator ] );
}

/**
 * Retrieves an emitter that can be used to send events to the controller using a specific communicator.
 * It returns a function that needs to be called with the correct parameters to send an event.
 *
 * @param communicator Communicator for which to create an emitter
 * @returns Emitter function
 */
export function useEmitter<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
    communicator: C
): (...params: CommunicatorEventParameters<C>) => void {
    const context = useContext( getContext( "communicator" ) );

    return useCallback( ( ...params: CommunicatorEventParameters<C> ) => {
        if( !context )
            return;
        context.emit( communicator, ...params );
    }, [ context, communicator ] );
}

/**
 * Retrieve a function that can be used to check whether or not a communicator can be used for sending RPCs and emit events
 */
export function useHasCommunicatorAccess(): ( ( communicator: CommunicatorType<any, any> ) => boolean );

/**
 * Check whether or not a communicator can be used for sending RPCs and emit events
 * 
 * @param communicator 
 */
export function useHasCommunicatorAccess( communicator: CommunicatorType<any, any> ): boolean

export function useHasCommunicatorAccess(
    communicator?: CommunicatorType<any, any>
): boolean | ( ( communicator: CommunicatorType<any, any> ) => boolean ) {
    const context = useContext( getContext( "communicator" ) );

    if( communicator ) {
        if( !context )
            return true;
        return context.canUse( communicator );
    }
    
    if( !context )
        return () => true;
    return ( communicator ) => context.canUse( communicator );
}

/**
 * Retrieves an rpc (remote procedure call) function that can be used to call remote functions on the communicator.
 * It returns a function that can be called to invoke the remote function in the communicator.
 * This function will return a promise that will resolve the returned value by the communicator.
 *
 * @param communicator Communicator for which to create the rpc function
 * @returns RPC function
 */
export function useRPC<C extends CommunicatorType<any, ( ...p: any[] ) => any>>(
    communicator: C
): CommunicatorRPCFunction<C> {
    const context = useContext( getContext( "communicator" ) );

    const cancel = useRef( false );

    useEffect( () => {
        cancel.current = false;

        return () => {
            cancel.current = true;
        }
    }, [] );

    return useCallback( ( ...params: Parameters<CommunicatorRPCFunction<C>> ) => {
        if( !context )
            return new Promise( ( _, reject ) => reject( new Error( 'Communicator context is not available. Cannot send RPC.' ) ) );

        return new Promise( ( resolve, reject ) => {
            context.rpc( communicator, ...params )
                .then( ( value ) => {
                    if( cancel.current )
                        reject( new CancelledPromiseError() );
                    else
                        resolve( value );
                } ).catch( ( e ) => {
                    if( cancel.current )
                        reject( new CancelledPromiseError() );
                    else
                        reject( e );
                } );
        } );
    }, [ context, communicator, cancel ] );
}

export function useCommunicatorAvailable(): boolean {
    const context = useContext( getContext( "communicator" ) );

    const [ available, setAvailable ] = useState( false );

    useEffect( () => {
        if( !context )
            return setAvailable( false );

        const isAvailable = context.isAvailable();

        if( isAvailable )
            setAvailable( true );
        else {
            setAvailable( false );

            const destroy = context.whenAvailable( () => setAvailable( true ) );

            return destroy;
        }
    }, [ context, available ] );
    
    return available;
}

/**
 * Retrieves a value from a value communicator.
 * A value communicator is a way to share a value efficiently over the network.
 * It only sends changes to the object, which allows sharing of large objects efficiently.
 *
 * @param communicator 
 * @param initialValue 
 * @returns 
 */
export function useValue<T>(
    communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T
): T {
    const [ value, setValue ] = useState<T>( initialValue! );
    const isAvailable = useCommunicatorAvailable();

    const retrieve = useRPC( communicator );

    useEffect( () => {
        if( !isAvailable )
            return;

        retrieve()
            .then( ( value ) => {
                setValue( value as T );
            } )
            .catch( ( e ) => {
                console.error( 'Failed to retrieve value', e );
            } );
    }, [ isAvailable ] );

    useListener( communicator, ( diff ) => {
        setValue( applyDiff( value, diff ) );
    } );

    return value;
}

export class ValueConsumer<T> extends EventEmitter2 {

    private value?: T;
    private unregisterListener: () => void;

    constructor(
        private communicator: RendererCommunicator,
        valueCommunicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>,
        initialValue?: T
    ) {
        super();

        this.value = initialValue;

        this.unregisterListener = this.communicator.listen( valueCommunicator, ( diff ) => {
            this.value = applyDiff( this.value, diff );
            this.emit( 'update', this.value );
        } );

        this.communicator.whenAvailable( () => {
            this.communicator.rpc( valueCommunicator ) 
                .then( ( value ) => {
                    this.value = value as T;
                    this.emit( 'update', this.value );
                } )
                .catch( ( e ) => {
                    console.error( 'Failed to retrieve value', e );
                } );
        } );
    }

    getValue() {
        return this.value;
    }

    on( event: 'update', listener: ( value: T ) => void ) {
        return super.on( event, listener );
    }

    once( event: 'update', listener: ( value: T ) => void ) {
        return super.once( event, listener );
    }

    off( event: 'update', listener: ( value: T ) => void ) {
        return super.off( event, listener );
    }

    addListener( event: 'update', listener: ( value: T ) => void ) {
        return super.off( event, listener );
    }

    removeListener( event: 'update', listener: ( value: T ) => void ) {
        return super.off( event, listener );
    }

    destroy() {
        this.unregisterListener();
    }

}

export class CancelledPromiseError extends Error {
    constructor() {
        super( 'Promise has been cancelled.' );

        this.name = 'CancelledPromiseError';
    }
}