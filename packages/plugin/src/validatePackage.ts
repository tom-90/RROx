import path from "path";
import { promises as fs } from "fs";
import { createSpinner } from "./spinner.js";
import { RROXPackageJson } from "./types.js";

export async function validatePackage(): Promise<RROXPackageJson | undefined> {
    const spinner = createSpinner( 'Validating package.json' );

    spinner.start();

    let packageJson;

    const packageJsonPath = path.resolve( process.cwd(), 'package.json' );

    try {
        packageJson = JSON.parse(
            ( await fs.readFile( packageJsonPath ) ).toString()
        );
    } catch( e ) {
        spinner.fail( `Cannot parse package.json at location '${packageJsonPath}'` );
        return;
    }

    if( !packageJson.name?.startsWith( '@rrox-plugins/' ) ) {
        spinner.fail( `The package name should be of the form @rrox-plugins/XXX, but found '${packageJson.name}'` );
        return;
    }

    if( !packageJson.rrox || !packageJson.rrox.controller || !packageJson.rrox.renderer ) {
        spinner.fail(
            `The package.json file should include a config section for RROx:

    "rrox": {
        "controller": "dist/controller/controller.js",
        "renderer": "dist/renderer/renderer.js"
    }
`
        );
        return;
    }

    spinner.succeed( 'Validated package.json.');

    return packageJson;
}