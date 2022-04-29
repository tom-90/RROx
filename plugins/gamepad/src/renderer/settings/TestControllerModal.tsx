import React, {useEffect, useState} from "react";
import { Button, Modal, Slider, Row, Col, Checkbox } from "antd";

export function TestControllerModal(
    {controllerIndex, isModalVisible, handleCloseCallback}: { controllerIndex: number, isModalVisible: boolean, handleCloseCallback: any },
) {
    const [ controllers, setControllers ] = useState<(Gamepad|null)[]>([]);

    useEffect( () => {
        const listener = () => {
            const gamepads = navigator.getGamepads();
            setControllers(Array.from(gamepads));
        };

        const interval = setInterval(() => {
            if(controllerIndex > -1){
                listener();
            }
        }, 50);

        return () => {
            clearInterval(interval);
        };
    }, [controllerIndex] );

    const vibrate = () => {
        let gamePad = controllers[controllerIndex];
        // @ts-ignore
        gamePad?.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: 500,
            weakMagnitude: 1,
            strongMagnitude: 1,
        });
    }

    return <Modal
        title="Test Controller"
        visible={isModalVisible}
        onCancel={handleCloseCallback}
        footer={[
            <Button key="close" onClick={handleCloseCallback}>
                Close
            </Button>
        ]}>
        <Row justify={"center"}>
            <Col>
                <Row justify={"center"}>
                    <Col style={{width: "100px"}}>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Left Y
                        </label>
                        <Slider
                            vertical
                            min={-100}
                            max={100}
                            marks={{
                                "-100": "-100%",
                                0: "0%",
                                100: "100%"
                            }}
                            style={{height: "200px"}}
                            value={(controllers[controllerIndex]?.axes[1] ?? 0) * -100}
                        />
                    </Col>
                    <Col style={{width: "100px"}}>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Right Y
                        </label>
                        <Slider
                            vertical
                            min={-100}
                            max={100}
                            marks={{
                                "-100": "-100%",
                                0: "0%",
                                100: "100%"
                            }}
                            style={{height: "200px"}}
                            value={(controllers[controllerIndex]?.axes[3] ?? 0) * -100}
                        />
                    </Col>
                    <Col style={{width: "100px"}}>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Left Trigger
                        </label>
                        <Slider
                            vertical
                            min={0}
                            max={100}
                            marks={{
                                0: "0%",
                                100: "100%"
                            }}
                            style={{height: "200px"}}
                            value={(controllers[controllerIndex]?.buttons[6].value ?? 0) * 100}
                        />
                    </Col>
                    <Col style={{width: "100px"}}>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Right Trigger
                        </label>
                        <Slider
                            vertical
                            min={0}
                            max={100}
                            marks={{
                                0: "0%",
                                100: "100%"
                            }}
                            style={{height: "200px"}}
                            value={(controllers[controllerIndex]?.buttons[7].value ?? 0) * 100}
                        />
                    </Col>
                </Row>
                <Row gutter={50} justify={"center"}>
                    <Col>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Left Y
                        </label>
                        <Slider
                            min={-100}
                            max={100}
                            marks={{
                                "-100": "-100%",
                                0: "0%",
                                100: "100%"
                            }}
                            style={{width: "150px"}}
                            value={(controllers[controllerIndex]?.axes[0] ?? 0) * 100}
                        />
                    </Col>
                    <Col>
                        <label
                            style={{textAlign: "center"}}
                        >
                            Right Y
                        </label>
                        <Slider
                            min={-100}
                            max={100}
                            marks={{
                                "-100": "-100%",
                                0: "0%",
                                100: "100%"
                            }}
                            style={{width: "150px"}}
                            value={(controllers[controllerIndex]?.axes[2] ?? 0) * 100}
                        />
                    </Col>
                </Row>
            </Col>
            <Col style={{display: "flex", flexDirection: "column", justifyContent: "center", width: "100%"}} >
                <label
                    style={{textAlign: "center"}}
                >
                    Buttons
                </label>
                <Row gutter={20}  justify={"center"}>
                    <Col style={{display: "flex", flexDirection: "column"}}>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[0]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 0
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[1]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 1
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[2]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 2
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[3]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 3
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[4]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 4
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[5]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 5
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[6]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 6
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[7]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 7
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[8]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 8
                        </Checkbox>
                    </Col>
                    <Col style={{display: "flex", flexDirection: "column"}}>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[9]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 9
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[10]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 10
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[11]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 11
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[12]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 12
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[13]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 13
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[14]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 14
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[15]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 15
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[16]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 16
                        </Checkbox>
                        <Checkbox
                            checked={controllers[controllerIndex]?.buttons[17]?.pressed}
                            style={{marginLeft: 0}}
                        >
                            Button 17
                        </Checkbox>
                    </Col>
                </Row>
            </Col>
            <Col style={{marginTop: "20px"}}>
                <Button key="vibrate" onClick={vibrate}>
                    Vibrate
                </Button>
            </Col>
        </Row>
    </Modal>;
}