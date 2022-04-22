import { KeybindsCommunicator } from "../../shared/communicators";
import { RROxApp } from "../app";
import iohook from "iohook";
import { isGameFocussed } from "./window";
import EventEmitter from "events";
import { KeyCodes } from "../../shared/keycodes";

export class KeybindsController {
    private pressedKeys: number[] = [];
    private keybinds: ( number[] | undefined )[] = [];
    private emitter = new EventEmitter();

    constructor( private app: RROxApp ) {
        app.communicator.handle( KeybindsCommunicator, ( keybindsOrId ) => {
            if( typeof keybindsOrId === 'number' ) {
                this.removeKeybind( keybindsOrId )
                return keybindsOrId;
            } else
                return this.addKeybind( keybindsOrId );
        } );

        iohook.on( 'keydown', this.onGlobalKeyDown );
        iohook.on( 'keyup'  , this.onGlobalKeyUp   );
        iohook.setDebug( true );
        iohook.start();
    }

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
        if( !isGameFocussed() )
            return;

        this.onKeyDown( keycode );
    };

    private onGlobalKeyUp = ( e: { rawcode: number } ) => {
        this.onKeyUp( this.getKeyCode( e ) );
    };

    private getNextID() {
        let i = 0;
        for( i = 0; i <= this.keybinds.length; i++ )
            if( this.keybinds[ i ] === undefined )
                break;
        return i;
    }
    
    private isPressed( keyBind: number[], keyDownCode: number ) {
        return keyBind.length > 0 && keyBind.every( ( code ) => this.pressedKeys.includes( code ) ) && keyBind.includes( keyDownCode );
    }
    
    private onKeyDown( code: number ) {
        if( this.pressedKeys.includes( code ) )
            return;

        this.pressedKeys.push( code );

        for( let i = 0; i < this.keybinds.length; i++ ) {
            const keybind = this.keybinds[ i ];

            if( keybind && this.isPressed( keybind, code ) ) {
                this.app.communicator.emit( KeybindsCommunicator, i );
                this.emitter.emit( i.toString() );
            }
        }
    }

    private onKeyUp( code: number ) {
        this.pressedKeys = this.pressedKeys.filter( ( c ) => c !== code );
    }

    public addKeybind( keybind: number[] ): number {
        const id = this.getNextID();
        this.keybinds[ id ] = keybind;
        return id;
    }

    public removeKeybind( id: number ) {
        if( id >= 0 && this.keybinds.length > id )
            this.keybinds[ id ] = undefined;
        this.emitter.removeAllListeners( id.toString() );
    }

    public addListener( id: number, callback: () => void ) {
        this.emitter.addListener( id.toString(), callback );
    }

    public on( id: number, callback: () => void ) {
        this.emitter.on( id.toString(), callback );
    }

    public once( id: number, callback: () => void ) {
        this.emitter.once( id.toString(), callback );
    }

    public removeListener( id: number, callback: () => void ) {
        this.emitter.removeListener( id.toString(), callback );
    }
}