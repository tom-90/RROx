import React, {useEffect, useState} from "react";
import { Form, Switch, Select, Divider, Collapse, Empty, Card, Radio, Button } from "antd";
import {useSettings} from "@rrox/api";
import { GamepadSettings } from "../../shared";
import { controlNames } from "../../shared/controls";
import {useWorld} from "@rrox/world/renderer";
import {TestControllerModal} from "./TestControllerModal";

const buttons = [
    {button: 0, description: "Bottom button in right cluster"},
    {button: 1, description: "Right button in right cluster"},
    {button: 2, description: "Left button in right cluster"},
    {button: 3, description: "Top button in right cluster"},
    {button: 4, description: "Shoulder left front button"},
    {button: 5, description: "Shoulder right front button"},
    {button: 6, description: "Shoulder left back button"},
    {button: 7, description: "Shoulder right back button"},
    {button: 8, description: "Left button in center cluster"},
    {button: 9, description: "Right button in center cluster"},
    {button: 10, description: "Left stick pressed button"},
    {button: 11, description: "Right stick pressed button"},
    {button: 12, description: "Top button in left cluster"},
    {button: 13, description: "Bottom button in left cluster"},
    {button: 14, description: "Left button in left cluster"},
    {button: 15, description: "Right button in left cluster"},
    {button: 16, description: "Vendor button 1"},
    {button: 17, description: "Vendor button 2"}
];
const buttonValues: number[] = [];
for (let i = -100; i < 101; i++) {
    buttonValues.push(i);
}

export function GamepadSettingsPage() {
    const [ settings, store ] = useSettings( GamepadSettings );
    const [ form ] = Form.useForm();
    const [ controllers, setControllers ] = useState<(Gamepad|null)[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentModalController, setCurrentModalController] = useState<(number)>(-1);
    const world = useWorld();

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
            listener();
        } );
        window.addEventListener( 'gamepaddisconnected', listener );

        listener();

        return () => {
            window.removeEventListener( 'gamepadconnected', listener );
            window.removeEventListener( 'gamepaddisconnected', listener );
        };
    }, [] );

    const showModal = (controller_id: React.SetStateAction<number>) => {
        setCurrentModalController(controller_id);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setCurrentModalController(-1);
        setIsModalVisible(false);
    };

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

        <Form.Item
            label="Enable"
            name={[ "gamepad", "enabled" ]}
            valuePropName="checked"
        >
            <Switch />
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
                                    <Select.Option value="map_follow" key="map_follow">Following engine</Select.Option>
                                    {world?.frameCars.map((car, index) => (
                                        <Select.Option value={index} key={index}>{car.type + (car.name ? ` (${car.name.replace('<br>', ' ')})` : "")}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Divider orientation="left">Left Stick</Divider>
                            <Card
                                title="X Axes"
                                style={{marginInline: "40px", marginBottom: "10px"}}
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

                            <Card
                                title="Y Axes"
                                style={{marginInline: "40px", marginBottom: "10px"}}
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

                            <Divider orientation="left">Right Stick</Divider>
                            <Card
                                title="X Axes"
                                style={{marginInline: "40px", marginBottom: "10px"}}
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

                            <Card
                                title="Y Axes"
                                style={{marginInline: "40px", marginBottom: "10px"}}
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


                            <Divider orientation="left">Trigger</Divider>
                            <Card
                                title="Left"
                                style={{marginInline: "40px", marginBottom: "10px"}}
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
                                style={{marginInline: "40px", marginBottom: "10px"}}
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


                            <Divider orientation="left">Buttons</Divider>
                            {buttons.map(({button, description}) => (
                                <Card
                                    title={`Button ${button} (${description})`}
                                    style={{marginInline: "40px", marginBottom: "10px"}}
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

                        </Collapse.Panel>
                    ))}
                </Collapse>
            )}
        </div>

    </Form>;
}