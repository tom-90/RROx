const fs = require( 'fs' );
const path = require( 'path' );
const contents = [];

function include( file ) {
    contents.push( fs.readFileSync( path.resolve( __dirname, '../', file ), 'utf8' ) );
}


include( 'bootstrap.lua' );
include( 'ue4lib.lua' );
include( 'ue4init.lua' );
include( 'definitions.lua' );
include( 'actions/address.lua' );
include( 'actions/addressValue.lua' );
include( 'actions/injectDLL.lua' );
include( 'actions/readWorld.lua' );
include( 'actions/player.lua' );
include( 'transmitter.lua' );


fs.writeFileSync( path.resolve( __dirname, 'script.lua' ), contents.join( '\n' ) );