import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Divider } from "antd";
import { useMapData } from "../helpers/mapData";
import { useSocketSession } from "../helpers/socket";
import { defaultSettings, useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { BackgroundSettings, ColorSettings } from "@rrox/components";

export function MapSettings() {
    const [ form ] = Form.useForm();
    const [ settings, setSettings ] = useSettings();

    return (
        <MapPageLayout style={{ overflowY: 'auto' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: 20 }}>
                <Form
                    name="settings"
                    layout="vertical"
                    labelCol={{ span: 8, offset: 3 }}
                    wrapperCol={{ span: 16, offset: 3 }}
                    initialValues={settings}
                    form={form}
                    
                    onValuesChange={( changed ) => {
                        setSettings( changed );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Map</Divider>
                    <BackgroundSettings name="map.background" />
                    <Divider orientation="left">Colors</Divider>
                    <ColorSettings
                        resetToDefault={( ...keys: string[] ) => {
                            let newValues: { [ key: string ]: any } = {};
                            for( let key of keys )
                                newValues[ key ] = defaultSettings[ key ];
                            form.setFieldsValue( setSettings( newValues ) );
                        }}
                    />
                </Form>
            </div>
        </MapPageLayout>
    );
}