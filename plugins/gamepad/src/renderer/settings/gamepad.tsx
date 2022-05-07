import React, {useEffect, useState} from "react";
import {Form, Switch, Select, Divider, Collapse, Empty, Card, Radio, Button, Alert, InputNumber, Tabs} from "antd";
import {useSettings} from "@rrox/api";
import { GamepadSettings } from "../../shared";
import { controlNames } from "../../shared/controls";
import {useWorld} from "@rrox-plugins/world/renderer";
import {TestControllerModal} from "./TestControllerModal";
import {isEngine} from "@rrox-plugins/world/shared";
import { isFirefox, isSafari } from "react-device-detect";

const buttons = [
    {button: 0, description: "A"},
    {button: 1, description: "B"},
    {button: 2, description: "X"},
    {button: 3, description: "Y"},
    {button: 4, description: "Left Bumper"},
    {button: 5, description: "Right Bumper"},
    {button: 6, description: "Left Trigger"},
    {button: 7, description: "Right Trigger"},
    {button: 8, description: "Back"},
    {button: 9, description: "Start"},
    {button: 10, description: "Left Stick"},
    {button: 11, description: "Right Stick"},
    {button: 12, description: "D-Pad Up"},
    {button: 13, description: "D-Pad Down"},
    {button: 14, description: "D-Pad Left"},
    {button: 15, description: "D-Pad Right"},
    {button: 16, description: "Xbox Button"}
];
const buttonValues: number[] = [];
for (let i = -100; i < 101; i++) {
    buttonValues.push(i);
}

const vibrationOptions = [
    {
        value: "boilerPressure",
        label: "Boiler Pressure"
    },
    {
        value: "airPressure",
        label: "Air Pressure"
    },
    {
        value: "waterTemperature",
        label: "Water Temperature"
    },
    {
        value: "waterLevel",
        label: "Water Level"
    },
    {
        value: "fireTemperature",
        label: "Fire Temperature"
    },
    {
        value: "fuelAmount",
        label: "Fuel Amount"
    }
]

const hasGamepadApiSupport = () => {
    return window.navigator.getGamepads && typeof window.navigator.getGamepads === 'function';
};

export function GamepadSettingsPage() {
    const [ settings, store ] = useSettings( GamepadSettings );
    const [ form ] = Form.useForm();
    const [ controllers, setControllers ] = useState<(Gamepad|null)[]>([]);
    const [ isModalVisible, setIsModalVisible] = useState(false);
    const [ prevEnabledState, setPrevEnabledState] = useState(false);
    const [currentModalController, setCurrentModalController] = useState<(number)>(-1);
    const world = useWorld();
    let gamepadSupported = !isFirefox && !isSafari;

    useEffect( () => {
        form.setFieldsValue( settings );
    }, [ settings ] );

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

        if(!gamepadSupported){
            store.set<string, boolean>(`gamepad.enabled`, false);
        }

        return () => {
            window.removeEventListener( 'gamepadconnected', listener );
            window.removeEventListener( 'gamepaddisconnected', listener );
        };
    }, [] );

    const showModal = (controller_id: React.SetStateAction<number>) => {
        setCurrentModalController(controller_id);
        setIsModalVisible(true);
        store.set<string, boolean>(`gamepad.enabled`, false);
        setPrevEnabledState(settings.gamepad.enabled);
    };

    const handleClose = () => {
        setCurrentModalController(-1);
        setIsModalVisible(false);
        store.set<string, boolean>(`gamepad.enabled`, prevEnabledState);
        setPrevEnabledState(false);
    };

    if(!hasGamepadApiSupport()){
        return <Alert message="Your browser does not support the Gamepad API - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API" type="error" />
    }

    return <Form
        name="settings"
        layout="vertical"
        form={form}
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changes ) => store.setAll(changes)}
        autoComplete="off"
    >
        <TestControllerModal
            controllerIndex={currentModalController}
            isModalVisible={isModalVisible}
            handleCloseCallback={handleClose}
        />

        {!gamepadSupported && (
            <Alert
                style={{"marginInline": "20px", "marginBottom": "20px"}}
                message="Firefox and Safari do not support the Gamepad API - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API"
                type="error"
            />
        )}

        <Form.Item
            label="Enable"
            name={[ "gamepad", "enabled" ]}
            valuePropName="checked"
        >
            <Switch
                disabled={!gamepadSupported}
            />
        </Form.Item>

        <Divider orientation="left">Controllers</Divider>

        <div
            style={{marginInline: "20px"}}
        >
            {controllers.filter(controller => controller != null).length == 0 ? (
                <Empty
                    description="No controllers found"
                >
                    <p>Press any button on the controller to add it</p>
                </Empty>
            ) : (
                <Collapse>
                    {controllers.filter(controller => controller != null).map(controller => (
                        <Collapse.Panel
                            header={controller?.id}
                            key={controller!.index}
                        >
                            <Button
                                type="primary"
                                onClick={() => {
                                    showModal(controller!.index);
                                }}
                                style={{marginInline: "40px", marginBottom: "20px"}}
                            >
                                Test Controller
                            </Button>

                            <Form.Item
                                label="Engine"
                                name={[ "gamepad", "bindings", controller!.id, "engine" ]}
                                labelCol={{offset: 0}}
                                wrapperCol={{offset: 0}}
                                style={{marginInline: "40px", marginBottom: "10px"}}
                            >
                                <Select
                                    style={{ maxWidth: 300 }}
                                >
                                    {/*<Select.Option value="map_follow" key="map_follow">Following engine</Select.Option>*/}
                                    {world?.frameCars
                                        .map((car, index) => ({car, index}))
                                        .filter(({car}) => isEngine(car))
                                        .map(({car, index}) => (
                                            <Select.Option value={index} key={index}>{car.type + (car.name ? ` (${car.name.replace('<br>', ' ')})` : "")}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Tabs
                                defaultActiveKey="1"
                                style={{marginInline: "40px", marginBottom: "10px"}}
                            >
                                <Tabs.TabPane tab="Analog" key="1">
                                    <Divider orientation="left">Left Stick</Divider>
                                    <Card
                                        title="Y Axes (Up/Down)"
                                        style={{marginBottom: "10px"}}
                                        key="left_y"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "left", "y", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "left", "y", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>

                                    <Card
                                        title="X Axes (Left/Right)"
                                        style={{marginBottom: "10px"}}
                                        key="left_x"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "left", "x", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "left", "x", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>

                                    <Divider orientation="left">Right Stick</Divider>
                                    <Card
                                        title="Y Axes (Up/Down)"
                                        style={{marginBottom: "10px"}}
                                        key="right_y"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "right", "y", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "right", "y", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>

                                    <Card
                                        title="X Axes (Left/Right)"
                                        style={{marginBottom: "10px"}}
                                        key="right_x"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "right", "x", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "right", "x", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>


                                    <Divider orientation="left">Trigger</Divider>
                                    <Card
                                        title="Left"
                                        style={{marginBottom: "10px"}}
                                        key="left_trigger"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "left", "trigger", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "left", "trigger", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>

                                    <Card
                                        title="Right"
                                        style={{marginBottom: "10px"}}
                                        key="right_trigger"
                                    >
                                        <Form.Item
                                            label="Binding"
                                            name={["gamepad", "bindings", controller!.id, "right", "trigger", "binding"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="none" key="none">None</Select.Option>
                                                {Object.entries(controlNames).map(([control, name]) => (
                                                    <Select.Option value={control} key={control}>{name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Value"
                                            name={["gamepad", "bindings", controller!.id, "right", "trigger", "value"]}
                                            labelCol={{offset: 0}}
                                            wrapperCol={{offset: 0}}
                                        >
                                            <Select
                                                style={{ maxWidth: 300 }}
                                            >
                                                <Select.Option value="controller_value" key="controller_value">Controller value</Select.Option>
                                                <Select.Option value="controller_change" key="controller_change">Controller change</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Buttons" key="5">
                                    <Divider orientation="left">Buttons</Divider>
                                    {buttons.map(({button, description}) => (
                                        <Card
                                            title={`Button ${button} (${description})`}
                                            style={{marginBottom: "10px"}}
                                            key={`button.${button}`}
                                        >
                                            <Form.Item
                                                label="Binding"
                                                name={["gamepad", "bindings", controller!.id, "buttons", button, "binding"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Select
                                                    style={{ maxWidth: 300 }}
                                                >
                                                    <Select.Option value="none" key="none">None</Select.Option>
                                                    {Object.entries(controlNames).map(([control, name]) => (
                                                        <Select.Option value={control} key={control}>{name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Mode"
                                                name={["gamepad", "bindings", controller!.id, "buttons", button, "mode"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Radio.Group>
                                                    <Radio value="hold" key="hold" defaultChecked>Hold</Radio>
                                                    <Radio value="toggle" key="toggle">Toggle</Radio>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item
                                                label="Key up"
                                                name={["gamepad", "bindings", controller!.id, "buttons", button, "value", "up"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Select
                                                    style={{ maxWidth: 300 }}
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => {
                                                        let value = option?.children[0];
                                                        let data = `${value}`;
                                                        return data.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }}
                                                >
                                                    {buttonValues.map((value) => (
                                                        <Select.Option value={value} key={value}>{value}%</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Key down"
                                                name={["gamepad", "bindings", controller!.id, "buttons", button, "value", "down"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Select
                                                    style={{ maxWidth: 300 }}
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => {
                                                        let value = option?.children[0];
                                                        let data = `${value}`;
                                                        return data.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }}
                                                >
                                                    {buttonValues.map((value) => (
                                                        <Select.Option value={value} key={value}>{value}%</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                        </Card>
                                    ))}
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Vibration Warnings" key="6">
                                    <Divider orientation="left">Vibrate Warnings</Divider>

                                    {vibrationOptions.map(({value, label}) => (
                                        <Card
                                            title={label}
                                            style={{marginBottom: "10px"}}
                                            key={`vibrationOptions-${value}`}
                                        >

                                            <Form.Item
                                                label="Type"
                                                name={["gamepad", "vibrationWarning", controller!.id, value, "type"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Radio.Group>
                                                    <Radio value="value" key="hold" defaultChecked>Value</Radio>
                                                    <Radio value="percent" key="toggle">Percent</Radio>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item
                                                label={(settings.gamepad.vibrationWarning[controller!.id].boilerPressure.type === "value" ? "Value" : "Percent") + " (Enter 0 to disable)"}
                                                name={["gamepad", "vibrationWarning", controller!.id, value, "value"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <InputNumber
                                                    style={{ maxWidth: 300 }}
                                                    min={0}
                                                    max={settings.gamepad.vibrationWarning[controller!.id].boilerPressure.type === "value" ? 99999999 : 100}
                                                    addonAfter={settings.gamepad.vibrationWarning[controller!.id].boilerPressure.type === "value" ? "" : "%"}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Pattern"
                                                name={["gamepad", "vibrationWarning", controller!.id, value, "pattern"]}
                                                labelCol={{offset: 0}}
                                                wrapperCol={{offset: 0}}
                                            >
                                                <Select
                                                    style={{ maxWidth: 300 }}
                                                >
                                                    <Select.Option value="pulse_1" key="pulse_1">Pulse 1 time</Select.Option>
                                                    <Select.Option value="pulse_2" key="pulse_2">Pulse 2 times</Select.Option>
                                                    <Select.Option value="pulse_3" key="pulse_3">Pulse 3 times</Select.Option>
                                                    <Select.Option value="pulse_4" key="pulse_4">Pulse 4 times</Select.Option>
                                                    <Select.Option value="long" key="long">Long (1s)</Select.Option>
                                                    <Select.Option value="very_long" key="very_long">Very Long (2s)</Select.Option>
                                                </Select>
                                            </Form.Item>

                                        </Card>
                                    ))}

                                </Tabs.TabPane>
                            </Tabs>

                        </Collapse.Panel>
                    ))}
                </Collapse>
            )}
        </div>

    </Form>;
}