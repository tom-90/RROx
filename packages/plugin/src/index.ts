import { Command } from 'commander';
import { startApp } from './start-app.js';
import { validatePackage } from './validatePackage.js';
import { startWebpack } from './webpack.js';

const program = new Command();

program
    .command( 'start' )
    .description( 'Start the compilation in watch mode' )
    .action( async () => {
        const packageJson = await validatePackage();
        if( !packageJson )
            return;

        await startWebpack( packageJson, true );
    } );

program
    .command( 'start-app' )
    .description( 'Start the desktop RROx app' )
    .action( async () => {
        await startApp();
    } );

program
    .command( 'build' )
    .description( 'Build the plugin' )
    .action( async () => {
        const packageJson = await validatePackage();
        if( !packageJson )
            return;

        await startWebpack( packageJson, false );
    } );

program.parse( process.argv );

if ( program.args.length === 0 )
    program.outputHelp();