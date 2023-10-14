import React, { useCallback, useContext } from "react";
import { Button } from "antd";
import { MapPopupElementProps } from "../../registrations";
import { useRPC } from "@rrox/api";
import { MapContext } from "../../context";
import { FrameCarType, isEngine, TeleportCommunicator } from "@rrox-plugins/world/shared";

export function TeleportPopupButton( props: MapPopupElementProps ) {
    const { currentPlayerName, settings } = useContext( MapContext )!;

    const teleportRpc = useRPC( TeleportCommunicator );

    const teleport = useCallback( () => {
        if( props.frame )
            teleportRpc( currentPlayerName, {
                X: props.frame.location.X,
                Y: props.frame.location.Y,
                Z: props.frame.location.Z + ( props.frame.type === FrameCarType.CABOOSE ? 0 : 500 ),
            } );
        else if( props.industry )
            teleportRpc( currentPlayerName, {
                X: props.industry.location.X,
                Y: props.industry.location.Y,
                Z: props.industry.location.Z + 1000
            } );
        else if( props.sandhouse )
            teleportRpc( currentPlayerName, {
                X: props.sandhouse.location.X,
                Y: props.sandhouse.location.Y,
                Z: props.sandhouse.location.Z + 1000
            } );
        else if( props.watertower )
            teleportRpc( currentPlayerName, {
                X: props.watertower.location.X,
                Y: props.watertower.location.Y,
                Z: props.watertower.location.Z + 1000
            } );
    }, [ currentPlayerName, props.frame, props.industry, props.sandhouse, props.watertower, teleportRpc ] );

    if( !settings.features.teleport || ( !props.frame && !props.industry && !props.sandhouse && !props.watertower ) )
        return null;
    if( props.frame && !isEngine( props.frame ) && props.frame.type !== FrameCarType.CABOOSE && props.frame.type !== FrameCarType.WAYCAR && props.frame.type !== FrameCarType.COACH_DSPRR_1 )
        return null;

    return <Button
        style={{ marginTop: 5 }}
        onClick={teleport}
    >Teleport Here</Button>;
}