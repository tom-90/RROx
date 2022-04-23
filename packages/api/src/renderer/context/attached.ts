import { useContext } from "react";
import { getContext } from "./internal";

export type AttachedContext = boolean;

export function useAttached(): AttachedContext {
    return useContext( getContext( "attached" ) );
}