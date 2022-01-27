const fs = require( 'fs-extra' );
const path = require( 'path' );

const copy = ( dir ) => {
    console.log( path.resolve( __dirname, dir ) );
    console.log( )
    fs.copySync(
        path.resolve( __dirname, dir ),
        path.resolve( path.dirname( require.resolve( 'iohook/package.json' ) ), "builds", dir )
    );
};

copy( "electron-v98-win32-x64" );
copy( "node-v93-win32-x64" );