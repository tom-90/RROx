import { Action } from "./actions";
import { NamedPipe, NamedPipeServer } from "./net";
import { StructStore } from "./struct";
import { Attacher } from "./attacher";
import { PluginManager, SettingsManager } from "./plugins";
import { EventEmitter } from "events";
import { BrowserWindow } from "electron";
import { ControllerCommunicator } from "@rrox/api";
import { KeybindsController, ShareCommunicator, ShareController } from "./utils";

interface RROxAppEvents {
    on( event: 'connect'   , listener: ( pipe: NamedPipe ) => void ): this;
    on( event: 'ready'     , listener: () => void                  ): this;
    on( event: 'disconnect', listener: ( pipe: NamedPipe ) => void ): this;
}

export class RROxApp extends EventEmitter implements RROxAppEvents {
    public communicator: ControllerCommunicator = new ShareCommunicator( this );
    public settings = new SettingsManager( this.communicator );

    public structs    = new StructStore();
    public pipeServer = new NamedPipeServer( this, 'RRO' );
    public plugins    = new PluginManager( this );
    public attacher   = new Attacher( this );
    public shared     = new ShareController( this );
    public keybinds   = new KeybindsController( this );

    public windows: BrowserWindow[] = [];

    private pipe?: NamedPipe;
    private actions = new Map<{ new( app: RROxApp ): Action }, Action>();

    constructor() {
        super();

        this.on( 'connect', ( pipe ) => this.pipe = pipe );
        this.on( 'disconnect', () => this.pipe = undefined );
    }

    public getPipe() {
        return this.pipe;
    }

    public isConnected() {
        return this.pipe != null;
    }

    public getAction<A extends Action>( action: { new( app: RROxApp ): A } ): A {
        if( this.actions.has( action ) )
            return this.actions.get( action )! as A;

        const instance = new action( this );
        this.actions.set( action, instance );

        return instance;
    }

    public addWindow( window: BrowserWindow ) {
        this.windows.push( window );
        window.on( 'close', () => this.windows = this.windows.filter( ( w ) => w !== window ) );
    }

    /**
     * Broadcast message to all browser windows
     *
     * @param channel 
     * @param args 
     */
    public broadcast( channel: string, ...args: any[] ) {
        if( !this.windows )
            return;
        this.windows.forEach( ( w ) => w.webContents.send( channel, ...args ) );

        this.shared.broadcast( channel, ...args );
    }
}