const { log: origLog, info: origInfo, warn: origWarn, error: origError } = console;

const windowType = new URL( window.location.href ).searchParams.get( 'mode' ) === 'overlay' ? 'overlay' : 'app';

Object.assign( console, {
    log: ( ...params: any[] ) => {
        origLog( ...params );
        window.ipc.send( 'log', 'info', params, windowType );
    },
    info: ( ...params: any[] ) => {
        origInfo( ...params );
        window.ipc.send( 'log', 'info', params, windowType );
    },
    warn: ( ...params: any[] ) => {
        origWarn( ...params );
        window.ipc.send( 'log', 'warn', params, windowType );
    },
    error: ( ...params: any[] ) => {
        origError( ...params );
        window.ipc.send( 'log', 'error', params, windowType );
    }
} );

window.addEventListener( 'error', ( e ) => {
    e.preventDefault();
    window.ipc.send( 'log', 'unhandled-error', [ e.error ], windowType );
} );

window.addEventListener( 'unhandledrejection', ( e ) => {
    e.preventDefault();
    window.ipc.send( 'log', 'unhandled-rejection', [ e.reason ], windowType );
} );