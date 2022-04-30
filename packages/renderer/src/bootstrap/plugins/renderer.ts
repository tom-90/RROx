import { Registration, RegistrationType, IPluginRenderer, Renderer, RegistrationParameters, RendererCommunicator, RendererMode, ShareMode } from "@rrox/api";
import path from "path-browserify";
import { LogFunctions } from "electron-log";
import { loadScript } from "../utils";
import { RegistrationController, RegistrationStore } from "../registrations";
import { IPlugin } from "./type";
import { PluginManagerMode } from "./manager";
import { SettingsManager } from "./settings";

declare const __webpack_remotes__: any;
declare const __webpack_share_scopes__: any;

export class PluginRenderer implements IPluginRenderer {
    public instance?: Renderer;

    constructor( 
        private store: RegistrationStore,
        public communicator: RendererCommunicator,
        public settings: SettingsManager,
        public rendererMode: RendererMode,
        public shareMode: ShareMode,
        private plugin: IPlugin,
        private log: LogFunctions
    ) {};

    /**
     * Register the plugin to an existing registration point.
     *
     * @param registration Registration for which to register
     * @param parameters Parameters for the registration
     * @returns Registration which can be used for unregistering
     */
    register<R extends RegistrationType<( ...params: any[] ) => void>>( registration: R, ...parameters: RegistrationParameters<R> ): Registration<R> {
        return this.store.register(
            registration,
            {
                plugin : this.plugin.name,
                version: this.plugin.version,
            },
            ...parameters
        );
    }

    /**
     * Unregister an registration point.
     * 
     * @param registration Registration to unregister.
     */
    unregister<R extends RegistrationType<( ...params: any[] ) => void>>( registration: Registration<R> ): void {
        this.store.unregister( registration );
    }

    /**
     * Get controller for an registration
     * 
     * @param registration Registration to get the controller for
     */
    getRegistrationController<R extends RegistrationType<( ...params: any[] ) => void>>( registration: R ): RegistrationController<R> {
        return this.store.getController( registration );
    }

    async load( mode: PluginManagerMode ): Promise<boolean> {
        try {
            if( !this.plugin.rendererEntry )
                throw new Error( 'No renderer entry specified.' );

            await loadScript( this.resolvePluginPath( mode ) );
    
            if( !__webpack_remotes__[ this.plugin.name ] )
                throw new Error( 'The plugin failed to initialize.' );

            const pkg = __webpack_remotes__[ this.plugin.name ];

            await pkg.init( __webpack_share_scopes__.default );

            const pluginClass = ( await pkg.get( '.' ) )().default;
    
            if( typeof pluginClass !== 'function'
                || !pluginClass.prototype
                || typeof pluginClass.prototype.load !== 'function'
                || typeof pluginClass.prototype.unload !== 'function' )
                throw new Error( 'Default export of index file is not a valid plugin.' );
    
            const controller = new pluginClass() as Renderer;
    
            await controller.load( this );

            return true;
        } catch( e ) {
            this.log.error( 'Failed to load', this.plugin.name, e );
            return false;
        }
    }

    async unload(): Promise<boolean> {
        if( !this.instance )
            return true;

        try {
            await this.instance.unload( this );

            this.instance = undefined;

            this.store.unregisterPlugin( this.plugin.name );

            return true;
        } catch( e ) {
            this.log.error( 'Failed to unload', this.plugin.name, e );
            return false;
        }
    }

    private resolvePluginPath( mode: PluginManagerMode ) {
        if( mode === PluginManagerMode.Local )
            return path.join( this.plugin.rootDir, this.plugin.rendererEntry! );
        else
            return new URL( path.resolve( `/${this.plugin.name}@${this.plugin.version}`, this.plugin.rendererEntry! ), 'https://rrox-cdn.tom90.nl' ).toString();
    }
}