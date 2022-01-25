const fs = require( 'fs' );
const path = require( 'path' );
const XML = require( './xml-js' );
const contents = [];

function include( file ) {
    contents.push( fs.readFileSync( path.resolve( __dirname, '../scripts', file ), 'utf8' ) );
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
include( 'actions/setAddressValue.lua' );
include( 'actions/vegetationSpawners.lua' );
include( 'transmitter.lua' );

let data = XML.xml2js( fs.readFileSync( path.resolve( __dirname, '../Injector.CT' ) ) );

let scriptEl = data
    .elements.find( ( { name } ) => name === 'CheatTable' )
    .elements.find( ( { name } ) => name === 'LuaScript' )
    .elements.find( ( { type } ) => type === 'text' );

scriptEl.text = contents.join( '\n' );

fs.writeFileSync( path.resolve( __dirname, '../Injector.CT' ), XML.js2xml( data, { compact: false, spaces: 2 } ).replace( /\r?\n|\r/g, "\r\n" ) + '\r\n' );