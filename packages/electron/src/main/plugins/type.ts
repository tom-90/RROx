import { CleanupFunction, Controller, SetupFunction } from "@rrox/api";

export interface IPlugin {
    name   : string;
    version: string;
    
    description?: string;
    author?: string;
    hasUpdate: boolean;

    controllerEntry: string;
    rendererEntry?: string;

    rootDir: string;

    dev: boolean

    dependencies: string[];
}

export interface ILoadedPlugin extends IPlugin {
    controller?: Controller;
}

export interface ISetupFunction {
    function: SetupFunction;
    executed: boolean;
    cleanup?: CleanupFunction;
}