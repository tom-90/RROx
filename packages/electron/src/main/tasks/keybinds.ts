import { NamedPipe } from "../pipes";
import { Task } from "./task";
import Log from "electron-log";
import { AutosaveTask, OverlayTask } from ".";
import iohook from "iohook";
import { KeyCodes } from "@rrox/types";

export class KeybindsTask extends Task {

    public taskName = "Keybinds";

    private pipeListeners: { pipe: NamedPipe, onData: ( data: Buffer ) => void, onEnd: () => void }[] = [];

    private listenKeys: number[] = [];

    private getKeyCode( e: { rawcode: number } ) {
        let keycode = e.rawcode;
        if( keycode === KeyCodes.VK_LCONTROL || keycode === KeyCodes.VK_RCONTROL )
            keycode = KeyCodes.VK_CONTROL;
        else if( keycode === KeyCodes.VK_LMENU || keycode === KeyCodes.VK_RMENU )
            keycode = KeyCodes.VK_MENU;
        else if( keycode === KeyCodes.VK_LSHIFT || keycode === KeyCodes.VK_RSHIFT )
            keycode = KeyCodes.VK_SHIFT;

        return keycode;
    }

    private onGlobalKeyDown = ( e: { rawcode: number } ) => {
        const keycode = this.getKeyCode( e );
        if( !this.listenKeys.includes( keycode ) )
            return;
        if( !this.app.getTask( OverlayTask ).isGameFocussed() )
            return;

        this.onKeyDown( keycode );
    };

    private onGlobalKeyUp = ( e: { rawcode: number } ) => {
        this.onKeyUp( this.getKeyCode( e ) );
    };

    private onConfigUpdate = () => {
        this.listenKeys = [
            ...this.app.settings.get( 'keybind.openMap' ),
            ...this.app.settings.get( 'keybind.autosave' ),
        ];
    };

    private isPressed( key: string ) {
        const keys: number[] = this.app.settings.get( key );
        
        return keys.every( ( code ) => this.pressedKeys.includes( code ) );
    }

    public start() {
        this.app.on( 'settings-update', this.onConfigUpdate );
        iohook.on( 'keydown', this.onGlobalKeyDown );
        iohook.on( 'keyup'  , this.onGlobalKeyUp   );
        iohook.start();

        this.onConfigUpdate();
    }

    public stop() {
        this.app.removeListener( 'settings-update', this.onConfigUpdate );
        iohook.removeListener( 'keydown', this.onGlobalKeyDown );
        iohook.removeListener( 'keyup'  , this.onGlobalKeyUp   );
        iohook.stop();

        this.pipeListeners.forEach( ( data ) => {
            data.pipe.socket.removeListener( 'data', data.onData );
            data.pipe.socket.removeListener( 'end' , data.onEnd  );
        } );
        this.pipeListeners = [];
    }

    private pressedKeys: number[] = [];

    public onKeyDown( code: number ) {
        if( !this.listenKeys.includes( code ) || this.pressedKeys.includes( code ) )
            return;

        this.pressedKeys.push( code );

        if( this.isPressed( 'keybind.openMap' ) )
            this.app.getTask( OverlayTask ).onToggleMap();
        else if( this.isPressed( 'keybind.autosave' ) )
            this.app.getTask( AutosaveTask ).runNow();
    }

    public onKeyUp( code: number ) {
        this.pressedKeys = this.pressedKeys.filter( ( c ) => c !== code );
    }
}