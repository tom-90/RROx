declare global {
    const __webpack_init_sharing__: ( key: string ) => Promise<void>;
    const __webpack_share_scopes__: { [ key: string ]: any };
}

const RENDERER_PATH = document.querySelector<HTMLMetaElement>( 'meta[name="renderer-entry"]' )!.content;
const RENDERER_NAME = '@rrox/electron';

export async function init() {
    try {
        await __webpack_init_sharing__( 'default' );

        const { loadScript, PluginManager } = ( await import( '@rrox/renderer/bootstrap' ) );
        const { SocketCommunicator } = ( await import( './communicator' ) );
        const { WebLogger } = ( await import( './logger' ) );
        const { Logger, RendererMode, ShareMode } = ( await import( '@rrox/api' ) );

        new Logger( new WebLogger() );
        const manager = new PluginManager( new SocketCommunicator(), RendererMode.WEB );

        manager.setShareMode( ShareMode.CLIENT );

        await loadScript( RENDERER_PATH );

        if( !window.__webpack_remotes__[ RENDERER_NAME ] )
            throw new Error( 'Renderer failed to fully initialize.' );

        window.__webpack_remotes__[ RENDERER_NAME ].init( __webpack_share_scopes__.default );

        const { init } = ( await window.__webpack_remotes__[ RENDERER_NAME ].get( '.' ) )();

        await init( manager );
    } catch( e ) {
        console.error( e );
    }
}

init();