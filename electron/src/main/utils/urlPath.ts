import { pathToFileURL } from "url";

/**
 * We convert the entry path to a version that respects special characters like hashtags
 * 
 * @param entry 
 * @returns 
 */
export function convertEntryPath( entry: string ) {
    if( entry.startsWith( 'file://' ) )
        return pathToFileURL( entry.substring( 7 ) );
    else
        return new URL( entry );
}