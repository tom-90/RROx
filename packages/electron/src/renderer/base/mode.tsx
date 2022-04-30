import React, { useMemo } from "react";
import { ModeContext, OverlayMode, RendererMode, useValue, ShareMode } from "@rrox/api";
import { ModeContext as Context } from "@rrox/renderer";
import { OverlayModeCommunicator, ShareModeCommunicator } from "../../shared";

export function ModeContext( { children, rendererMode }: { children?: React.ReactNode, rendererMode: RendererMode } ) {
    const overlayMode = useValue( OverlayModeCommunicator, OverlayMode.HIDDEN );
    const shareMode = useValue( ShareModeCommunicator, ShareMode.NONE );

    const value = useMemo<ModeContext>( () => ( {
        renderer: rendererMode,
        overlay : overlayMode,
        share   : shareMode,
    } ), [ rendererMode, overlayMode, shareMode ] );

    return <Context.Provider value={value} children={children} />;
}