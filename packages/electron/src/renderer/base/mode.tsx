import React, { useMemo } from "react";
import { ModeContext, OverlayMode, RendererMode, useValue } from "@rrox/api";
import { ModeContext as Context } from "@rrox/renderer";
import { OverlayModeCommunicator } from "../../shared";

export function ModeContext( { children, rendererMode }: { children?: React.ReactNode, rendererMode: RendererMode } ) {
    const overlayMode = useValue( OverlayModeCommunicator, OverlayMode.HIDDEN );

    const value = useMemo<ModeContext>( () => ( {
        renderer: rendererMode,
        overlay : overlayMode
    } ), [ rendererMode, overlayMode ] );

    return <Context.Provider value={value} children={children} />;
}