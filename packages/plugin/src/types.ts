import { PackageJson as BasePackageJson } from 'type-fest';
import { Configuration } from 'webpack';

export interface RROXPackageJson extends BasePackageJson {
    rrox: {
        controller: string;
        renderer: string;
        controllerEntry?: string;
        rendererEntry?: string;
        pluginDependencies?: string[];
    }
}

export type Config = {
    /**
     * Get the current webpack configuration
     */
    get(): Configuration;

    /**
     * Merge a partial configuration into the current config
     * 
     * @param config Partial config to merge
     * @returns Complete merged configuration
     */
    merge( config: Configuration ): Configuration;

    /**
     * Overwrite the current configuration with a new one
     *
     * @param config 
     * @returns New configuration
     */
    set( config: Configuration ): Configuration;

    /**
     * The sharing mechanism controls the way different plugins can share/import each others files
     */
    sharing: {
        /**
         * Expose a specific key which other plugins should be able to import.
         * E.g. if another plugin wants to import `@rrox-plugin/example/test123`,
         * then you should expose the `./test123` key (`./` is required).
         * You can then point this import to any module inside your codebase.
         * 
         * @param key Import key to expose (e.g. `./test123`)
         * @param module Module to point the import to
         */
        expose( key: string, module: string | string[] | ExposesConfig ): void;

        /**
         * Adds a module to the shared modules list.
         * Some modules must only be loaded once, otherwise they do not work correctly.
         * Examples of this are `react` and libraries that use React's context API,
         * like `react-router`, `react-router-dom` but also `@rrox/base-ui`.
         * 
         * You can provide an optional config object to specify more options.
         * 
         * @param module Module to share with other plugins
         * @param config Additional config options
         */
        share( module: string, config?: string | SharedConfig ): void;

        /**
         * Retrieve the exposed and shared configurations
         */
        getConfig(): {
            exposed: { [ key: string ]: string | string[] | ExposesConfig },
            shared: { [ module: string ]: string | SharedConfig },
        }
    }
}

export interface ConfigAPI {
    renderer: Config;
    controller: Config;

    package: RROXPackageJson;
    development: boolean;
}

// Webpack Module Federation Types


/**
 * Advanced configuration for modules that should be shared in the share scope.
 */
export declare interface SharedConfig {
	/**
	 * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
	 */
	eager?: boolean;

	/**
	 * Provided module that should be provided to share scope. Also acts as fallback module if no shared module is found in share scope or version isn't valid. Defaults to the property name.
	 */
	import?: string | false;

	/**
	 * Package name to determine required version from description file. This is only needed when package name can't be automatically determined from request.
	 */
	packageName?: string;

	/**
	 * Version requirement from module in share scope.
	 */
	requiredVersion?: string | false;

	/**
	 * Module is looked up under this key from the share scope.
	 */
	shareKey?: string;

	/**
	 * Share scope name.
	 */
	shareScope?: string;

	/**
	 * Allow only a single version of the shared module in share scope (disabled by default).
	 */
	singleton?: boolean;

	/**
	 * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
	 */
	strictVersion?: boolean;

	/**
	 * Version of the provided module. Will replace lower matching versions, but not higher.
	 */
	version?: string | false;
}

/**
 * Advanced configuration for modules that should be exposed by this container.
 */
export declare interface ExposesConfig {
	/**
	 * Request to a module that should be exposed by this container.
	 */
	import: string | string[];

	/**
	 * Custom chunk name for the exposed module.
	 */
	name?: string;
}