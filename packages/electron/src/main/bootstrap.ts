import path from "path";

const MAIN_ENTRY = 'app_main.js';
const MAIN_NAME = '@rrox/electron';

( global as any ).__webpack_remotes__ = {};

export async function init() {
    try {
        await __webpack_init_sharing__( 'default' );

        __non_webpack_require__( path.join( __dirname, MAIN_ENTRY ) );

        if( !__webpack_remotes__[ MAIN_NAME ] )
            throw new Error( 'Renderer failed to fully initialize.' );

        __webpack_remotes__[ MAIN_NAME ].init( __webpack_share_scopes__.default );

        ( await __webpack_remotes__[ MAIN_NAME ].get( '.' ) )();
    } catch( e ) {
        console.error( e );
    }
}

init();