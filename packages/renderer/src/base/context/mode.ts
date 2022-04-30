import { ModeContext as ModeContextType, OverlayMode, RendererMode } from "@rrox/api";
import { ShareMode } from "@rrox/api/src/renderer/types";
import React from "react";

export const ModeContext = React.createContext<ModeContextType>( {
    renderer: RendererMode.WINDOW,
    overlay : OverlayMode.HIDDEN,
    share   : ShareMode.NONE,
} );