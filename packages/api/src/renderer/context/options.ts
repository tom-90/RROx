import { useContext } from "react";
import { getContext } from "./internal";

export type BaseOptionsContext = {
    playerName?: string,
}

/**
 * Retrieve base options that the user has configured for RROx
 *
 * @returns Base Options
 */
export function useBaseOptions(): BaseOptionsContext {
    return useContext( getContext( "options" ) );
}