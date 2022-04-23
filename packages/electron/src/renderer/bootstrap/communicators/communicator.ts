import { RendererCommunicator, CommunicatorEventParameters, CommunicatorRPCFunction, CommunicatorType } from "@rrox/api";

interface IPC {
    invoke: ( channel: string, ...args: any[] ) => Promise<any>,
    send: ( channel: string, ...args: any[] ) => void,
    on: ( channel: string, fn: ( event: Electron.IpcRendererEvent, ...args: any[] ) => void ) => () => void;
}

declare global {
    interface Window {
        ipc: () => IPC | null;
    }
}

export class IPCCommunicator implements RendererCommunicator {
    private ipc: IPC;

    constructor() {
        const ipc = window.ipc();
        if( !ipc )
            throw new Error( 'Cannot initialize IPC twice' );
        this.ipc = ipc;
    }

    protected communicatorToChannel( communicator: CommunicatorType<any, any> ) {
        return `c/${communicator.module.name}/${communicator.key}?shared=${communicator.shared}`;
    }

    listen<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, listener: ( ...args: CommunicatorEventParameters<C> ) => void
    ): () => void {
        return this.ipc.on( this.communicatorToChannel( communicator ), listener as ( ...args: any[] ) => void );
    }

    emit<C extends CommunicatorType<( ...p: any[] ) => void, any>>(
        communicator: C, ...args: CommunicatorEventParameters<C>
    ): void {
        return this.ipc.send( this.communicatorToChannel( communicator ), ...args );
    }

    rpc<C extends CommunicatorType<any, ( ...p: any[] ) => any>>(
        communicator: C, ...args: Parameters<CommunicatorRPCFunction<C>>
    ): ReturnType<CommunicatorRPCFunction<C>> {
        return this.ipc.invoke( this.communicatorToChannel( communicator ), ...args );
    }

    isAvailable(): boolean {
        // The IPC communicator is always available
        return true;
    }

    whenAvailable( callback: () => void ): () => void {
        // The IPC communicator is always available
        callback();

        return () => null;
    }

    canUse<C extends CommunicatorType<any, ( ...p: any[] ) => any>>( communicator: C ): boolean {
        // Regular IPC communication is always possible
        return true;
    }
}