import { Renderer } from "@rrox/api";

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
    controller?: Renderer;
}