import { Registration, RegistrationType, IPluginRenderer, Renderer, RegistrationParameters, RendererCommunicator } from "@rrox/api";
import path from "path-browserify";
import { LogFunctions } from "electron-log";
import { loadScript } from "../utils";
import { RegistrationController, RegistrationStore } from "../registrations";
import { IPlugin } from "./type";

export class PluginRenderer implements IPluginRenderer {
    public instance?: Renderer;

    constructor( 
        private store: RegistrationStore,
        public communicator: RendererCommunicator,
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

    async load(): Promise<boolean> {
        try {
            if( !this.plugin.rendererEntry )
                throw new Error( 'No renderer entry specified.' );

            await loadScript( path.join( this.plugin.rootDir, this.plugin.rendererEntry ) );
    
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

            return true;
        } catch( e ) {
            this.log.error( 'Failed to unload', this.plugin.name, e );
            return false;
        }
    }
}