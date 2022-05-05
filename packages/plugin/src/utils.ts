import path from "path";
import fs from 'fs-extra';

export function distToSrcPath( distPath: string, ext?: string, baseName?: string  ) {
    const normalized = path.normalize( distPath );

    const parts = normalized.split( path.sep );
    if( parts.length <= 1 || parts[ 0 ] !== 'dist' )
        return;

    parts[ 0 ] = 'src';

    let options: path.FormatInputPathObject = {};
    
    if( ext ) {
        options.ext = ext;
        options.base = '';
    }

    if( baseName ) {
        options.base = baseName;
    }

    return path.format( { ...path.parse( parts.join( path.sep ) ), ...options } );
}


export async function checkEntryPath( distPath: string, ext?: string, baseName?: string ) {
    const mappedPath = distToSrcPath( distPath, ext, baseName );
    if( mappedPath && await fs.pathExists( path.join( process.cwd(), mappedPath ) ) )
        return mappedPath;
    return undefined;
}