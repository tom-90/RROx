import { ModeContext as ModeContextType, OverlayMode, RendererMode } from "@rrox/api";
import React from "react";

export const ModeContext = React.createContext<ModeContextType>( {
    renderer: RendererMode.WINDOW,
    overlay : OverlayMode.HIDDEN,
} );