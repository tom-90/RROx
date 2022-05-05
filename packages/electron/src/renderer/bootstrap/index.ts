import { ElectronLog } from 'electron-log';

declare global {
    const __webpack_init_sharing__: ( key: string ) => Promise<void>;
    const __webpack_share_scopes__: { [ key: string ]: any };
}

declare const log: () => ElectronLog;

const RENDERER_PATH = process.env.NODE_ENV === 'development' ? 'app_window/index.js' : '../app_window/index.js';
const RENDERER_NAME = '@rrox/electron';

export async function init() {
    try {
        await __webpack_init_sharing__( 'default' );

        const { loadScript, PluginManager } = ( await import( '@rrox/renderer/bootstrap' ) );
        const { SharedCommunicator } = ( await import( './communicators' ) );
        const { Logger, RendererMode } = ( await import( '@rrox/api' ) );

        const rendererMode = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? RendererMode.OVERLAY : RendererMode.WINDOW;
        if ( rendererMode === RendererMode.OVERLAY )
            document.title = 'RROxOverlay';
        
        const electronLog = log();
        new Logger( electronLog );
        electronLog.catchErrors();
        
        const manager = new PluginManager( new SharedCommunicator(), rendererMode );
        

        await loadScript( RENDERER_PATH );

        if( !__webpack_remotes__[ RENDERER_NAME ] )
            throw new Error( 'Renderer failed to fully initialize.' );

        __webpack_remotes__[ RENDERER_NAME ].init( __webpack_share_scopes__.default );

        const { init } = ( await __webpack_remotes__[ RENDERER_NAME ].get( '.' ) )();

        await init( manager );
    } catch( e ) {
        console.error( e );
    }
}

init();