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

    private communicatorToChannel( communicator: CommunicatorType<( ...p: any[] ) => void,( ...p: any[] ) => any> ) {
        return `c/${communicator.module}/${communicator.key}`;
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
}