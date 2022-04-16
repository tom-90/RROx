import { CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType, ControllerCommunicator, ValueProvider as IValueProvider } from "@rrox/api";
import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { Diff, diff } from "deep-diff";
import { RROxApp } from "../app";
import { IPlugin } from "./type";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export class IPCCommunicator implements ControllerCommunicator {
    constructor( private app: RROxApp ) {}

    private communicatorToChannel( communicator: CommunicatorType<( ...p: any[] ) => void,( ...p: any[] ) => any> ) {
        return `c/${communicator.module.name}/${communicator.key}`;
    }

    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void
    ): () => void {
        const fn = ( _: IpcMainEvent, ...args: any[] ) => {
            return listener( ...args as Parameters<CommunicatorRPCFunction<C>> );
        };

        ipcMain.on( this.communicatorToChannel( communicator ), fn );

        return () => {
            ipcMain.removeListener( this.communicatorToChannel( communicator ), fn );
        };
    }

    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, ...args: CommunicatorEventParameters<C>
    ): void {
        this.app.broadcast( this.communicatorToChannel( communicator ), ...args );
    }

    handle<C extends CommunicatorType<any, ( ...p: any[] ) => any>>(
        communicator: C,
        handler: ( ...args: Parameters<CommunicatorRPCFunction<C>> ) => ReturnType<CommunicatorRPCFunction<C>> | Awaited<ReturnType<CommunicatorRPCFunction<C>>>
    ): () => void {
        const fn = ( _: IpcMainInvokeEvent, ...args: any[] ) => {
            return handler( ...args as Parameters<CommunicatorRPCFunction<C>> );
        };

        ipcMain.handle( this.communicatorToChannel( communicator ), fn );

        return () => {
            ipcMain.removeHandler( this.communicatorToChannel( communicator ) );
        };
    }
    
    provideValue<T>( communicator: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>, initialValue?: T ): ValueProvider<T> {
        return new ValueProvider( this, communicator, initialValue );
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
    
        return new ValueProvider( this, communicator, initialValue );
    }
}

export class ValueProvider<T> implements IValueProvider<T> {
    private value?: T;

    constructor(
        private communicator: ControllerCommunicator,
        private config: CommunicatorType<( diff: Diff<T>[] ) => void, () => T>,
        initialValue?: T
    ) {
        this.value = initialValue;

        communicator.handle( config, () => this.getValue()! as Awaited<T> );
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
        } )!;

        this.communicator.emit( this.config, difference );

        this.value = value;
    }
}