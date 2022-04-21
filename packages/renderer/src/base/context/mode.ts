import { ModeContext as ModeContextType, RendererMode } from "@rrox/api";
import React from "react";

export const ModeContext = React.createContext<ModeContextType>( RendererMode.WINDOW );