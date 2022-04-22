import { CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType, ControllerCommunicator, ValueProvider as IValueProvider } from "@rrox/api";
import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { Diff, diff } from "deep-diff";
import { RROxApp } from "../app";
import { IPlugin } from "./type";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export class IPCCommunicator implements ControllerCommunicator {
    private listeners: { [ channel: string ]: ( ( ...args: any[] ) => void )[] } = {};
    private handlers : { [ channel: string ]: ( ...args: any[] ) => any|Promise<any> } = {};

    constructor( protected app: RROxApp ) {}

    protected communicatorToChannel( communicator: CommunicatorType<( ...p: any[] ) => void,( ...p: any[] ) => any> ) {
        return `c/${communicator.module.name}/${communicator.key}?shared=${communicator.shared}`;
    }

    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void
    ): () => void {
        const fn = ( _: IpcMainEvent, ...args: any[] ) => {
            return listener( ...args as Parameters<CommunicatorRPCFunction<C>> );
        };

        const channel = this.communicatorToChannel( communicator );

        ipcMain.on( channel, fn );

        if( !this.listeners[ channel ] )
            this.listeners[ channel ] = [];

        this.listeners[ channel ].push( listener );

        return () => {
            this.listeners[ channel ] = this.listeners[ channel ].filter( ( l ) => l !== listener );
            ipcMain.removeListener( channel, fn );
        };
    }

    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C | string, ...args: CommunicatorEventParameters<C>
    ): void {
        this.app.broadcast( typeof communicator === 'string' ? communicator : this.communicatorToChannel( communicator ), ...args );
    }

    handle<C extends CommunicatorType<any, ( ...p: any[] ) => any>>(
        communicator: C,
        handler: ( ...args: Parameters<CommunicatorRPCFunction<C>> ) => ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>>
    ): () => void {
        const fn = ( _: IpcMainInvokeEvent, ...args: any[] ) => {
            return handler( ...args as Parameters<CommunicatorRPCFunction<C>> );
        };

        const channel = this.communicatorToChannel( communicator );

        ipcMain.handle( channel, fn );

        this.handlers[ channel ] = handler;

        return () => {
            ipcMain.removeHandler( this.communicatorToChannel( communicator ) );
            if( this.handlers[ channel ] === handler )
                delete this.handlers[ channel ];
        };
    }
    
    provideValue<T>( communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T ): ValueProvider<T> {
        return new ValueProvider( this, communicator, initialValue );
    }

    callListeners<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C | string, ...args: CommunicatorEventParameters<C> ): void {
        let channel = typeof communicator === 'string' ? communicator : this.communicatorToChannel( communicator );

        if( !this.listeners[ channel ] )
            return;

        this.listeners[ channel ].forEach( ( l ) => l( ...args ) );
    }

    callHandler<C extends CommunicatorType<any, ( ...p: any[] ) => any>>( communicator: C | string, ...args: Parameters<CommunicatorRPCFunction<C>> ): ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>> {
        let channel = typeof communicator === 'string' ? communicator : this.communicatorToChannel( communicator );

        if( !this.handlers[ channel ] )
            throw new Error( `Handler not available for channel '${channel}'.` );

        return this.handlers[ channel ]( ...args );
    }
}

export class PluginCommunicator implements ControllerCommunicator {
    constructor( private rootCommunicator: ControllerCommunicator, private plugin: IPlugin ) {}

    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void
    ): () => void {
        return this.rootCommunicator.listen( communicator, listener );
    }

    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, ...args: CommunicatorEventParameters<C>
    ): void {
        return this.rootCommunicator.emit( communicator, ...args );
    }

    handle<C extends CommunicatorType<any, ( ...p: any[] ) => any>>(
        communicator: C,
        handler: ( ...args: Parameters<CommunicatorRPCFunction<C>> ) => ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>>
    ): () => void {
        if( communicator.module.name !== this.plugin.name )
            throw new Error( 'Cannot register a handler for a communicator that is not owned by the plugin.' );
        return this.rootCommunicator.handle( communicator, handler );
    }
    
    provideValue<T>( communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T ): ValueProvider<T> {
        if( communicator.module.name !== this.plugin.name )
            throw new Error( 'Cannot register a value provider for a communicator that is not owned by the plugin.' );
    
        return this.rootCommunicator.provideValue( communicator, initialValue ) as ValueProvider<T>;
    }

    callListeners<C extends CommunicatorType<( ...p: any[] ) => void, any>>( communicator: C, ...args: CommunicatorEventParameters<C> ): void {
        return this.rootCommunicator.callListeners( communicator, ...args );
    }

    callHandler<C extends CommunicatorType<any, ( ...p: any[] ) => any>>( communicator: C, ...args: Parameters<CommunicatorRPCFunction<C>> ): ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>> {
        return this.rootCommunicator.callHandler( communicator, ...args );
    }
}

export class ValueProvider<T> implements IValueProvider<T> {
    private value?: T;
    private unregisterHandler: () => void;

    constructor(
        private communicator: ControllerCommunicator,
        private config: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>,
        initialValue?: T
    ) {
        this.value = initialValue;

        this.unregisterHandler = communicator.handle( config, () => this.getValue()! as Awaited<T> );
    }

    getValue(): T | undefined {
        return this.value;
    }

    provide( value: T ): void {
        const difference = diff<T>( this.value!, value, {
            normalize: ( path, key, lhs: any, rhs: any ) => {
                if( typeof lhs === 'number' && typeof rhs === 'number' ) {
                    lhs = Math.round( lhs * 100 ) / 100;
                    rhs = Math.round( rhs * 100 ) / 100;
                }

                return [ lhs, rhs ];
            }
        } );

        this.value = value;

        if( !difference )
            return;

        this.communicator.emit( this.config, difference );
    }

    getCommunicator() {
        return this.config;
    }

    destroy() {
        this.unregisterHandler();
    }
}