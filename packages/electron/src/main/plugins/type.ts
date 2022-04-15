import { CleanupFunction, Controller, Renderer, SetupFunction } from "@rrox/api";

export interface IPlugin {
    name   : string;
    version: string;

    controllerEntry: string;
    rendererEntry?: string;

    rootDir: string;

    dependencies: {
        [ name: string ]: string
    };
}

export interface ILoadedPlugin extends IPlugin {
    controller?: Controller;
}

export interface ISetupFunction {
    function: SetupFunction;
    executed: boolean;
    cleanup?: CleanupFunction;
}