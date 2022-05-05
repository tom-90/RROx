import fs from 'fs-extra';
import { spawn } from 'child_process';
import { createSpinner } from './spinner.js';
import semver from 'semver';

export async function startApp() {
    const spinner = await createSpinner( 'Locating RROx...' );
    spinner.start();

    const exists = await fs.pathExists( 'C:/Program Files/RROx/RailroadsOnline Extended.exe' );

    if( !exists ) {
        spinner.fail( 'Could not find RROx in the default install directory (C:\\Program Files\\RROx). Please start it manually.' );
        return;
    }

    const versions = ( await fs.readdir( 'C:/Program Files/RROx' ) )
        .filter( ( file ) => /^app-\d.\d.\d$/.test( file ) )
        .map( ( dir ) => dir.split( '-' )[ 1 ] );

    if( versions.length === 0 ) {
        spinner.fail( 'Could not find installed RROx versions. Please start it manually.' );
        return;
    }

    const [ newest ] = semver.rsort( versions );

    const versionPath = `C:/Program Files/RROx/app-${newest}/RailroadsOnline Extended.exe`
    const versionExists = await fs.pathExists( versionPath );

    if( !versionExists ) {
        spinner.fail( 'Could not find RROx version executable. Please start it manually.' );
        return;
    }

    spawn( versionPath, {
        stdio: 'inherit' 
    } );

    spinner.succeed( 'Started RROx' );
}