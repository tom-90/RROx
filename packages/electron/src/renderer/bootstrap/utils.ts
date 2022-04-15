const scripts: { [ path: string ]: Promise<void> | undefined } = {};

export function loadScript( path: string ) {
    if( scripts[ path ] )
        return scripts[ path ];

    let promise = new Promise<void>( ( resolve, reject ) => {
        let script = document.createElement( 'script' );

        script.onload = () => {
            script.remove();

            resolve();
        };

        script.onerror = () => {
            reject( new ScriptError( 'Script failed to load', path ) );
        };

        let src = path;

        if( !src ) {
            reject( new ScriptError( 'Package could not be found', path ) );
            return;
        }

        script.src = src;
        script.crossOrigin = 'anonymous';

        document.body.appendChild( script );
    } );

    scripts[ path ] = promise;

    return promise;
}

export class BootstrapLoadError extends Error {
    constructor( msg: string, public name: string ) {
        super( msg );

        this.name = `BootstrapLoadError (${name})`;
    }
}

export class ScriptError extends Error {
    constructor( msg: string, public name: string ) {
        super( msg );

        this.name = 'ScriptError';
    }
}
