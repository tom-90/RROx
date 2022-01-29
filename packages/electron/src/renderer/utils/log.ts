const { log: origLog, info: origInfo, warn: origWarn, error: origError } = console;

Object.assign( console, {
    log: ( ...params: any[] ) => {
        origLog( ...params );
        window.ipc.send( 'log', 'info', params );
    },
    info: ( ...params: any[] ) => {
        origInfo( ...params );
        window.ipc.send( 'log', 'info', params );
    },
    warn: ( ...params: any[] ) => {
        origWarn( ...params );
        window.ipc.send( 'log', 'warn', params );
    },
    error: ( ...params: any[] ) => {
        origError( ...params );
        window.ipc.send( 'log', 'error', params );
    }
} );

window.addEventListener( 'error', ( e ) => {
    e.preventDefault();
    window.ipc.send( 'log', 'unhandled-error', [ e.error ] );
} );

window.addEventListener( 'unhandledrejection', ( e ) => {
    e.preventDefault();
    window.ipc.send( 'log', 'unhandled-rejection', [ e.reason ] );
} );