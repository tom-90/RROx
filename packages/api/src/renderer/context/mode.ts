import { useContext } from "react";
import { RendererMode } from "..";
import { getContext } from "./internal";

export type ModeContext = RendererMode;

export function useMode(): ModeContext {
    return useContext( getContext( "mode" ) );
}