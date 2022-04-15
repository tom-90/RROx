import { ElectronLog } from 'electron-log';

export class Logger {
    private static readonly LOGGER_KEY = 'electronLogger';

    private static getGlobalLogger() {
        if( typeof window !== 'undefined' && this.LOGGER_KEY in window )
            return ( window as any )[ this.LOGGER_KEY as any ] as ElectronLog;
        if( typeof global !== 'undefined' && this.LOGGER_KEY in global )
            return ( global as any )[ this.LOGGER_KEY as any ] as ElectronLog;
        return null;
    }

    constructor( instance: ElectronLog ) {
        if( typeof window !== 'undefined' )
            ( window as any )[ Logger.LOGGER_KEY ] = instance;
        else if( typeof global !== 'undefined' )
            ( global as any )[ Logger.LOGGER_KEY ] = instance;
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