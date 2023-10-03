import { useSettings } from "@rrox/api";
import React, { useEffect } from "react";
import { Form, Radio, Avatar, Space} from "antd";
import { MapPreferences } from "../../shared";
import Background1 from '../images/bg1.jpg';
import Background2 from '../images/bg2.jpg';
import Background3 from '../images/bg3.jpg';
import Background4 from '../images/bg4.jpg';
import Background5 from '../images/bg5.jpg';
import Background6Preview from '../images/bg6preview.jpg';
import Background8 from '../images/bg8.jpg';

export function MapSettings() {
    const [ preferences, store ] = useSettings( MapPreferences );
    const [ form ] = Form.useForm();

    useEffect( () => {
        form.setFieldsValue( preferences );
    }, [ preferences ] );

    return <Form
        form={form}
        name="settings"
        layout="vertical"
        labelCol={{ span: 8, offset: 3 }}
        wrapperCol={{ span: 16, offset: 3 }}
        onValuesChange={( changed ) => store.setAll( changed )}
        autoComplete="off"
    >
        <Form.Item
            label="Map Background"
            name={[ 'map', 'background' ]}
        >
            <label>
				Manually select the Map Background you wish to use.
			</label>
			<br/>
			<label>
				-Please note that RROx will not auto select the correct Map Background for the map you are playing on (this Feature would need additional support from the Game Developers)
			</label>
			<hr/>
			<br/>
			<Radio.Group>
				<Space direction="vertical">
					<div>
						<label>Pine Valley</label>
						<br/>
						<Radio.Button value={6} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background6Preview} /></Radio.Button>
						<Radio.Button value={7} style={{ margin: '5px', padding: '5px', height: '100%', filter: 'invert(1)' }}><Avatar shape='square' size={128} src={Background6Preview} /></Radio.Button>
						<Radio.Button value={1} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background1} /></Radio.Button>
						<Radio.Button value={2} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background2} /></Radio.Button>
						<Radio.Button value={3} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background3} /></Radio.Button>
						<Radio.Button value={4} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background4} /></Radio.Button>
						<Radio.Button value={5} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background5} /></Radio.Button>				
					</div>
					<hr/>
					<br/><br/>
					<div>
						<label>Lake Valley</label>
						<br/>
						<Radio.Button value={8} style={{ margin: '5px', padding: '5px', height: '100%' }}><Avatar shape='square' size={128} src={Background8} /></Radio.Button>
					</div>
				</Space>
            </Radio.Group>
        </Form.Item>
    </Form>;
}