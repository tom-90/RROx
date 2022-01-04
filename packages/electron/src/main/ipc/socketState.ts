import { IPCHandler } from "./ipc";
import { SocketMode } from "../utils";

export class GetSocketStateIPCHandler extends IPCHandler {
    public taskName = 'Get WebSocket State IPC';

    public channel = 'get-socket-state';

    protected handle() {
        const isActive = this.app.socket.isActive();
        return {
            active  : isActive,
            mode    : isActive ? this.app.socket.mode : undefined,
            shareURL: isActive ? this.app.socket.getURLFromKey( this.app.socket.key ) : undefined
        }
    }
}

export class SetSocketStateIPCHandler extends IPCHandler<[ mode: SocketMode.HOST ] | [ mode: SocketMode.CLIENT, url: string ] | [ mode: false ]> {
    public taskName = 'Set Socket State IPC';

    public channel = 'set-socket-state';

    protected handle( mode: SocketMode | false, url?: string ) {
        if( mode === false || mode !== this.app.socket.mode ) {
            if( this.app.socket.mode === SocketMode.HOST )
                this.app.socket.stopHostSession();
            else if( this.app.socket.mode === SocketMode.CLIENT )
                this.app.socket.leave();
        }

        if( mode === SocketMode.CLIENT )
            return this.app.socket.join( this.app.socket.getKeyFromURL( url ) ).then( () => this.app.socket.getURLFromKey( this.app.socket.key ) );
        else if( mode === SocketMode.HOST )
            return this.app.socket.createHostSession().then( ( key ) => this.app.socket.getURLFromKey( key ) );
    }
}