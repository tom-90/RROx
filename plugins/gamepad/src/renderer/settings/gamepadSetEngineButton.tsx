import React from "react";
import { Button } from "antd";
import { MapPopupElementProps } from "@rrox-plugins/map/src/renderer";
import { FrameCarType, isEngine, TeleportCommunicator } from "@rrox-plugins/world/shared";

export function GamepadSetEngineButton(props: MapPopupElementProps ){

    const setEngine = () => {
        console.log("GamepadSetEngineButton clicked")
    }


    if( props.frame && !isEngine( props.frame ) && props.frame.type !== FrameCarType.CABOOSE )
        return null;

    return <Button
        style={{ marginTop: 5 }}
        onClick={setEngine}
    >Gamepad Control</Button>;
}