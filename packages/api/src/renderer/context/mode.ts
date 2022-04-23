import { useContext } from "react";
import { RendererMode, OverlayMode } from "..";
import { getContext } from "./internal";

export type ModeContext = {
    renderer: RendererMode,
    overlay: OverlayMode,
};

export function useRendererMode(): RendererMode {
    return useContext( getContext( "mode" ) ).renderer;
}

export function useOverlayMode(): OverlayMode {
    return useContext( getContext( "mode" ) ).overlay;
}