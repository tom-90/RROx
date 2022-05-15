import { LogFunctions } from 'electron-log';

export interface ILogger extends LogFunctions {
    scope( label: string ): LogFunctions;
}

/**
 * The logger is a generic API that you can use for keeping log messages for your plugin.
 * By using this API, instead of `console.log`, it will make sure that your log messages
 * will be stored correctly on all different platforms that RROx runs.
 * In particular, the RROx desktop app will store your log messages inside the user's AppData folder.
 */
export class Logger {
    private static readonly LOGGER_KEY = 'electronLogger';

    private static getGlobalLogger() {
        if( typeof window !== 'undefined' && this.LOGGER_KEY in window )
            return ( window as any )[ this.LOGGER_KEY as any ] as ILogger;
        if( typeof global !== 'undefined' && this.LOGGER_KEY in global )
            return ( global as any )[ this.LOGGER_KEY as any ] as ILogger;
        return null;
    }

    constructor( instance: ILogger ) {
        if( typeof window !== 'undefined' )
            ( window as any )[ Logger.LOGGER_KEY ] = instance;
        else if( typeof global !== 'undefined' )
            ( global as any )[ Logger.LOGGER_KEY ] = instance;

        Object.assign( console, instance.scope( '' ) );
    }

    /**
     * Retrieve the logger instance for the plugin
     */
    public static get( plugin: PluginInfo ) {
        const logger = this.getGlobalLogger();

        if( !logger )
            throw new Error( 'Logger is not available' );

        return logger.scope( plugin.name );
    }

}