import React from 'react';
import { Form, Radio, Avatar } from 'antd';
import Background1 from '@rrox/assets/images/bg1.jpg';
import Background2 from '@rrox/assets/images/bg2.jpg';
import Background3 from '@rrox/assets/images/bg3.jpg';
import Background4 from '@rrox/assets/images/bg4.jpg';
import Background5 from '@rrox/assets/images/bg5.jpg';
import Background6Preview from '@rrox/assets/images/bg6preview.jpg';

export function BackgroundSettings( { name }: { name: string }) {
    return <Form.Item
        label="Map Background"
        name={name}
    >
        <Radio.Group>
            <Radio.Button value={6} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background6Preview} /></Radio.Button>
            <Radio.Button value={7} style={{ margin: '5px', padding: '5px', height: '100%', filter: 'invert(1)' }}><Avatar shape='square' size={128} src={Background6Preview} /></Radio.Button>
            <Radio.Button value={1} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background1} /></Radio.Button>
            <Radio.Button value={2} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background2} /></Radio.Button>
            <Radio.Button value={3} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background3} /></Radio.Button>
            <Radio.Button value={4} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background4} /></Radio.Button>
            <Radio.Button value={5} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background5} /></Radio.Button>
        </Radio.Group>
    </Form.Item>;
}