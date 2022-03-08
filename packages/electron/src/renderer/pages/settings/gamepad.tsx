import { Form, FormInstance, InputNumber, Select, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { Settings } from '.';

export function GamepadSettings( { settings }: { settings: any, form: FormInstance } ) {
    const [gamepads, setGamepads] = useState(Object.values(navigator.getGamepads()).filter(gamepad => gamepad));
    const [gamepadId, setGamepadId] = useState(settings['gamepad.device']);
    const [axes, setAxes] = useState([] as readonly number[]);

    const gamepadConnected = (e: GamepadEvent) => {
        setGamepads([...navigator.getGamepads()].filter(gamepad => gamepad));
    };

    useEffect(() => {
        document.addEventListener( 'gamepadconnected', gamepadConnected );

        return () => {
            document.removeEventListener( 'gamepadconnected', gamepadConnected );
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentGamepads = Object.values(navigator.getGamepads());
            const gamepad = currentGamepads.find(gamepad => gamepad.id === gamepadId);
            
            if (gamepad) {
                setAxes(gamepad.axes);
            }
            else {
                setAxes([]);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [gamepadId]);

    return <>
        <div>
            {axes.map((a, i) => <p>Axis {i}: {a}</p>)}
        </div>
        <Form.Item
            label="Device"
            name="gamepad.device"
        >
            <Select style={{ maxWidth: 300 }} onChange={id => setGamepadId(id)}>
                {
                    gamepads.map(gamepad => <Select.Option key={gamepad.index} value={gamepad.id}>{gamepad.id}</Select.Option>)
                }
            </Select>
        </Form.Item>
        <Form.Item
            label="Regulator Axis"
            name="gamepad.regulatorAxis.index"
        >
            <InputNumber style={{ maxWidth: 300 }} min={0} max={axes.length - 1} />
        </Form.Item>
        <Form.Item
            label="Invert Regulator"
            name="gamepad.regulatorAxis.invert"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        
        <Form.Item
            label="Brake Axis"
            name="gamepad.brakeAxis.index"
        >
            <InputNumber style={{ maxWidth: 300 }} min={0} max={axes.length - 1} />
        </Form.Item>
        <Form.Item
            label="Invert Brake"
            name="gamepad.brakeAxis.invert"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
        
        <Form.Item
            label="Reverser Axis"
            name="gamepad.reverserAxis.index"
        >
            <InputNumber style={{ maxWidth: 300 }} min={0} max={axes.length - 1} />
        </Form.Item>
        <Form.Item
            label="Invert Reverser"
            name="gamepad.reverserAxis.invert"
            valuePropName="checked"
        >
            <Switch />
        </Form.Item>
    </>;
}