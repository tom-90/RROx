import React, {useEffect, useState} from "react";
import { Button, Modal, List } from "antd";
import { MapPopupElementProps } from "@rrox-plugins/map/src/renderer";
import { FrameCarType, isEngine } from "@rrox-plugins/world/shared";
import {useSettings} from "@rrox/api";
import {GamepadSettings} from "../../shared";

export function GamepadSetEngineButton(props: MapPopupElementProps ){
    const [ settings, store ] = useSettings( GamepadSettings );
    const [ controllers, setControllers ] = useState<(Gamepad|null)[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const setEngine = (controllerId: string, engineIndex: number | undefined) => {
        store.set<string, number | undefined>(`gamepad.bindings.${controllerId}.engine`, engineIndex);
        closeModal();
    }

    useEffect( () => {
        const listener = () => {
            const gamepads = navigator.getGamepads();
            setControllers(Array.from(gamepads));
        };
        window.addEventListener( 'gamepadconnected', (event) => {
            store.set<string, object>(`gamepad.bindings.${event.gamepad.id}`, {});
            store.set<string, object>(`gamepad.vibrationWarning.${event.gamepad.id}`, {});
            listener();
        } );
        window.addEventListener( 'gamepaddisconnected', listener );
        listener();

        return () => {
            window.removeEventListener( 'gamepadconnected', listener );
            window.removeEventListener( 'gamepaddisconnected', listener );
        };
    }, [] );

    const openModal = () => {
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    if(props.frame && !isEngine( props.frame ) && props.frame.type !== FrameCarType.CABOOSE )
        return null;

    if(props.index === undefined || !settings.gamepad.enabled)
        return null;

    return <>
        <Button
            style={{ marginTop: 5 }}
            onClick={openModal}
        >Gamepad Control</Button>
        <Modal
            title="Set engine control"
            visible={isModalVisible}
            onCancel={closeModal}
            footer={[
               <Button key="Close" onClick={closeModal}>
                   Close
               </Button>,
            ]}
        >
            <List
                header={<div>Controllers</div>}
                bordered
                dataSource={controllers.filter(controller => controller != null)}
                renderItem={controllers => (
                    <List.Item
                        style={{backgroundColor: props.index == settings.gamepad.bindings[controllers!.id].engine ? "rgba(0,255,0,0.1)" : "transparent"}}
                    >
                        <div>{controllers!.id}</div>
                        <div>
                            <Button
                                key="SetEngine"
                                disabled={props.index == settings.gamepad.bindings[controllers!.id].engine}
                                onClick={() => {
                                setEngine(controllers!.id, props.index);
                            }}>
                                Set Engine
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    </>;
}