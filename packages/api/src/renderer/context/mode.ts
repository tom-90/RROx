import { useContext } from "react";
import { RendererMode, OverlayMode } from "..";
import { ShareMode } from "../types";
import { getContext } from "./internal";

export type ModeContext = {
    renderer: RendererMode,
    overlay: OverlayMode,
    share: ShareMode
};

/**
 * Hook to retrieve the renderer mode.
 * The renderer mode describes the way that the renderer is currently running.
 * 
 * @returns Renderer mode
 */
export function useRendererMode(): RendererMode {
    return useContext( getContext( "mode" ) ).renderer;
}


/**
 * Hook to retrieve the overlay mode.
 * The overlay mode describes the current state of the overlay
 * 
 * @returns Overlay mode
 */
export function useOverlayMode(): OverlayMode {
    return useContext( getContext( "mode" ) ).overlay;
}


/**
 * Hook to retrieve the share mode.
 * The share mode describes the state of the session sharing mechanism.
 * 
 * @returns Share mode
 */
export function useShareMode(): ShareMode {
    return useContext( getContext( "mode" ) ).share;
}