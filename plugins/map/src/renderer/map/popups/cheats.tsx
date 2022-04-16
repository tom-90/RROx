import React, { useContext } from 'react';
import { DraggableModal } from 'ant-design-draggable-modal';
import { Divider, Form, InputNumber, Slider, Switch, Button } from 'antd';
import { MapContext } from '../context';
import { IPlayer } from '@rrox/world/shared';

export function Cheats( {
    className,
    data,
    isVisible,
    onClose
}: {
    className?: string,
    data: IPlayer,
    isVisible: boolean,
    onClose: () => void
} ) {
    const { actions } = useContext( MapContext )!;
    const [ form ] = Form.useForm();

    return <DraggableModal
        className={className}
        title={`${data.name} - Cheats`}
        visible={isVisible}
        footer={null}
        onCancel={onClose}
        destroyOnClose={true}
        zIndex={2000}
        initialHeight={725}
        initialWidth={625}
        modalRender={( content ) => {
            if( !React.isValidElement( content ) )
                return;
            return React.cloneElement( content, {
                onClick: ( e: React.SyntheticEvent ) => {
                    e.stopPropagation();
                }
            } );
        }}
    >
        <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            initialValues={{
                flying: data.FlySpeed != null,
                sprint: data.WalkSpeed != null,
                flySpeed: data.FlySpeed || 5000,
                walkSpeed: data.WalkSpeed || 5000,
            }}
            onValuesChange={( changes ) => {
                if( changes.flying == null && changes.sprint == null && changes.flySpeed == undefined && changes.walkSpeed == undefined )
                    return;

                const { flying, sprint, flySpeed, walkSpeed } = form.getFieldsValue();

                actions.setCheats( data.name, sprint ? walkSpeed : undefined, flying ? flySpeed : undefined );
            }}
        >
            <Divider orientation="left">Money &amp; XP</Divider>
            <Form.Item label='Increase Money by' name='money'>
                <InputNumber style={{ width: 200 }} />
            </Form.Item>
            <Form.Item
                label='Increase XP by'
                name='xp'
                help={<p style={{ padding: '10px 0 0 0' }}>Fill in the values that you want to modify.</p>}
            >
                <InputNumber style={{ width: 200 }} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 15 }}>
                <Button type='primary' onClick={() => {
                    const { xp, money } = form.getFieldsValue();

                    if( xp == null && money == null )
                        return;
                    actions.setMoneyAndXP( data.name, money, xp );
                }}>
                    Submit
                </Button>
            </Form.Item>
            <Divider orientation="left">Flying &amp; Sprinting</Divider>
            <Form.Item label='Enable Flying' name='flying' valuePropName='checked'>
                <Switch />
            </Form.Item>
            <Form.Item
                label='Fly Speed'
                name='flySpeed'
                normalize={( sliderVal: 0 | 50 | 100 ) => {
                    return ( {
                        0  : 2000,
                        50 : 5000,
                        100: 8000,
                    } )[ sliderVal ];
                }}
                getValueProps={( savedVal: 2000 | 5000 | 8000 ) => {
                    const value = {
                        2000: 0,
                        5000: 50,
                        8000: 100,
                    }[ savedVal ];

                    return { value };
                }}
                help={<p style={{ padding: '10px 0' }}>
                    The game does not have proper fly-controls.
                    Therefore, to control your height while flying, you have to go into third-person mode (press V) and point the camera up and down.
                </p>}
            >
                <Slider style={{ marginLeft: 20 }} marks={{
                    0: 'Slow',
                    50: 'Medium',
                    100: 'Fast',
                }} step={null} tooltipVisible={false} included={false}/>
            </Form.Item>
            <Form.Item label='Enable Fast Sprint' name='sprint' valuePropName='checked'>
                <Switch />
            </Form.Item>
            <Form.Item
                label='Sprint Speed'
                name='walkSpeed'
                normalize={( sliderVal: 0 | 50 | 100 ) => {
                    return ( {
                        0  : 2000,
                        50 : 5000,
                        100: 8000,
                    } )[ sliderVal ];
                }}
                getValueProps={( savedVal: 2000 | 5000 | 8000 ) => {
                    const value = {
                        2000: 0,
                        5000: 50,
                        8000: 100,
                    }[ savedVal ];
                    
                    return { value };
                }}
            >
                <Slider style={{ marginLeft: 20 }} marks={{
                    0: 'Slow',
                    50: 'Medium',
                    100: 'Fast',
                }} step={null} tooltipVisible={false} included={false}/>
            </Form.Item>
        </Form>
    </DraggableModal>;
}