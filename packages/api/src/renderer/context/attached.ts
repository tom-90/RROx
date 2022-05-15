import { useContext } from "react";
import { getContext } from "./internal";

export type AttachedContext = boolean;

/**
 * Hook that checks whether the user has attached RROx to the game.
 * 
 * @returns Whether or not the renderer is attached
 */
export function useAttached(): AttachedContext {
    return useContext( getContext( "attached" ) );
}