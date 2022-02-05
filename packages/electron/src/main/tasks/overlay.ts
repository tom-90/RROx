import { TimerTask } from "./task";
import { RROx } from "../rrox";
import { WindowType } from "../windows";
import { screen } from "electron";
import { focusGame, focusOverlay, getActiveWindow, getGameWindow } from "../utils";

export enum OverlayStates {
    HIDDEN = 0,
    MINIMAP = 1,
    MAP = 2,
}

export class OverlayTask extends TimerTask {

    public taskName = "Overlay";
    public interval = 500;

    private state = OverlayStates.HIDDEN;
    private minimapCorner: number;
    private shortcutsRegistered = false;
    private transparent = false;
    private background: number;

    constructor( app: RROx ) {
        super( app );

        app.on( 'settings-update', () => this.update() );
    }

    public start() {
        const window = this.app.getWindow( WindowType.Overlay );
        
        window.show();
        window.minimize();
        this.update();

        return super.start();
    }

    public stop() {
        return super.stop();
    }

    public onToggleMap() {
        if( !this.isGameFocussed() )
            return;
        this.toggleMap();
    }

    public isGameFocussed() {
        let activeWindow = getActiveWindow();
        return activeWindow && ( activeWindow.title === 'arr  ' || activeWindow.title === 'RROxOverlay' );
    }

    private toggleMap() {
        const overlay = this.app.getWindow( WindowType.Overlay );

        const isMinimapEnabled = this.app.settings.get( 'minimap.enabled' );
        
        if ( !isMinimapEnabled && !overlay.isMinimized() ) {
            this.hideMap();
            focusGame();
        } else if ( isMinimapEnabled && this.state !== OverlayStates.MINIMAP ) {
            this.showMinimap();
            focusGame();
        } else if ( !isMinimapEnabled || this.state === OverlayStates.MINIMAP ) {
            this.showMap();
            setTimeout( async () => {
                let attempts = 0;
                while( getActiveWindow()?.title !== 'RROxOverlay' && attempts < 10 ) {
                    focusOverlay();
                    attempts++;
                    await new Promise( ( resolve ) => setTimeout( resolve, 100 ) );
                }
            }, 50 );
        }
    }

    private update() {
        const isMinimapEnabled = this.app.settings.get( 'minimap.enabled' );
        const minimapCorner = this.app.settings.get( 'minimap.corner' );
        const transparent = this.app.settings.get( 'minimap.transparent' );

        if( isMinimapEnabled && this.isGameFocussed() && (
            this.state === OverlayStates.HIDDEN || this.minimapCorner !== minimapCorner || this.transparent !== transparent
        ) )
            this.showMinimap();
        else if( !isMinimapEnabled && this.state === OverlayStates.MINIMAP  )
            this.hideMap();
    }

    private hideMap() {
        const overlay = this.app.getWindow( WindowType.Overlay );

        overlay.minimize();
        overlay.setIgnoreMouseEvents( true );
        
        overlay.webContents.send( 'set-mode', 'minimap', true );

        this.state = OverlayStates.HIDDEN;
    }

    private showMinimap() {
        const overlay = this.app.getWindow( WindowType.Overlay );
        const gameWindow = getGameWindow();

        if ( !gameWindow )
            return false;

        const { bounds } = gameWindow;
        this.minimapCorner = this.app.settings.get( 'minimap.corner' );

        /*let width = gameBounds.width / 5;
        let height = gameBounds.height / 4;

        let x: number, y: number;

        if( this.minimapCorner === 1 ) { // Top Left
            x = gameBounds.x;
            y = gameBounds.y;
        } else if( this.minimapCorner === 2 ) { // Top Right
            x = gameBounds.x + gameBounds.width - width;
            y = gameBounds.y;
        } else if( this.minimapCorner === 3 ) { // Bottom Left
            x = gameBounds.x;
            y = gameBounds.y + gameBounds.height - height;
        } else if( this.minimapCorner === 4 ) { // Bottom Right
            x = gameBounds.x + gameBounds.width - width;
            y = gameBounds.y + gameBounds.height - height;
        } else
            return;*/

        if ( overlay.isMinimized() )
            overlay.restore();

        overlay.setIgnoreMouseEvents( true );

        overlay.setBounds( screen.screenToDipRect( overlay, {
            // All numbers need to be convertible to int
            x: Math.floor( bounds.x ),
            y: Math.floor( bounds.y ),
            width: Math.floor( bounds.width ),
            height: Math.floor( bounds.height )
        } ), false );

        this.transparent = this.app.settings.get( 'minimap.transparent' );
        this.background = this.app.settings.get( 'map.background' );

        overlay.webContents.send( 'set-mode', 'minimap', false );

        this.state = OverlayStates.MINIMAP;

        return true;
    }

    private showMap() {
        const overlay = this.app.getWindow( WindowType.Overlay );
        const gameWindow = getGameWindow();

        if ( !gameWindow )
            return false;

        const { bounds } = gameWindow;

        if ( overlay.isMinimized() )
            overlay.restore();
        
        overlay.setIgnoreMouseEvents( false );
        overlay.setBounds( screen.screenToDipRect( overlay, {
            // All numbers need to be convertible to int
            x: Math.floor( bounds.x ),
            y: Math.floor( bounds.y ),
            width: Math.floor( bounds.width ),
            height: Math.floor( bounds.height )
        } ), false );

        this.background = this.app.settings.get( 'map.background' );

        overlay.webContents.send( 'set-mode', 'map', false );

        this.state = OverlayStates.MAP;

        return true;
    }

    protected async execute(): Promise<void> {
        const focussed = this.isGameFocussed();
        const isMinimapEnabled = this.app.settings.get( 'minimap.enabled' );

        if( !focussed && this.state !== OverlayStates.HIDDEN )
            this.hideMap();
        else if( focussed && this.state === OverlayStates.HIDDEN && isMinimapEnabled ) {
            this.showMinimap();
            focusGame();
        }
    }

}