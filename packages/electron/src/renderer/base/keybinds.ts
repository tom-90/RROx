import { KeybindsContext, RendererCommunicator } from "@rrox/api";
import { KeybindsCommunicator, Log } from "../../shared";

export class KeybindsController implements Exclude<KeybindsContext, null> {
    private callbacks: ( ( () => void ) | undefined )[] = [];

    constructor( private communicator: RendererCommunicator ) {
        communicator.listen( KeybindsCommunicator, ( id ) => {
            if( this.callbacks[ id ] != undefined )
                this.callbacks[ id ]!();
        } );
    }

    listenKeybinds( keybinds: number[], callback: () => void ): () => void {
        let id = -1;

        this.communicator.rpc( KeybindsCommunicator, keybinds )
            .then( ( i ) => {
                if( id === -2 ) {
                    // We should immediately deregister
                    return this.communicator.rpc( KeybindsCommunicator, i );
                } else {
                    id = i;
                    this.callbacks[ id ] = callback;
                }
            } )
            .catch( ( e ) => {
                Log.error( 'Failed to listen for keybind',e ) ;
            } );

        return () => {
            if( id === -1 ) {
                id = -2;
                return;
            }

            this.callbacks[ id ] = undefined;
            this.communicator.rpc( KeybindsCommunicator, id )
                .catch( ( e ) => {
                    Log.error( 'Failed to deregister keybind', e );
                } );
        }
    }

}