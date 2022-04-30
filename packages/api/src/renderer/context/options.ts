import { useContext } from "react";
import { getContext } from "./internal";

export type BaseOptionsContext = {
    playerName?: string,
}

/**
 * Retrieve base options that the user has configured for RROx
 *
 * @returns 
 */
export function useBaseOptions(): BaseOptionsContext {
    return useContext( getContext( "options" ) );
}