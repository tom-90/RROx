import { useContext } from "react";
import { RendererMode, OverlayMode } from "..";
import { ShareMode } from "../types";
import { getContext } from "./internal";

export type ModeContext = {
    renderer: RendererMode,
    overlay: OverlayMode,
    share: ShareMode
};

export function useRendererMode(): RendererMode {
    return useContext( getContext( "mode" ) ).renderer;
}

export function useOverlayMode(): OverlayMode {
    return useContext( getContext( "mode" ) ).overlay;
}

export function useShareMode(): ShareMode {
    return useContext( getContext( "mode" ) ).share;
}