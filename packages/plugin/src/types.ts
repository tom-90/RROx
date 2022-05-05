import { PackageJson as BasePackageJson } from 'type-fest';


export interface RROXPackageJson extends BasePackageJson {
    rrox: {
        controller: string;
        renderer: string;
        controllerEntry?: string;
        rendererEntry?: string;
        pluginDependencies?: string[];
    }
}