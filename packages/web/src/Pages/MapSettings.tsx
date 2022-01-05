import React, { useMemo, useEffect } from "react";
import { Form, Divider, Radio } from "antd";
import { defaultSettings, useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { BackgroundSettings, ColorSettings } from "@rrox/components";
import { useMapData } from "../helpers/mapData";

export function MapSettings() {
    const [ form ] = Form.useForm();
    const [ settings, setSettings ] = useSettings();
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded } = useMapData();
    
    // When this page loads, we refresh the map data
    useEffect( () => {
        if( !mapDataLoaded )
            refreshMapData();
    }, [] );

    const throttleOnValuesChange = useMemo( () => {
        let values = {};
        let timeout: NodeJS.Timeout = null;

        return ( changedValues: any, callback: ( changedValues: any ) => void ) => {
            values = { ...values, ...changedValues };

            if( timeout != null )
                clearTimeout( timeout );

            timeout = setTimeout( () => {
                callback( values );
                clearTimeout( timeout );
                timeout = null;
                values = {};
            }, 500 );
        };
    }, [] );

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
                        throttleOnValuesChange( changed, ( values ) => setSettings( values ) );
                    }}
                    autoComplete="off"
                >
                    <Divider orientation="left">Map</Divider>
                    <BackgroundSettings name="map.background" />
                    <Form.Item name="multiplayer.client.playerName" label="Select your playername">
                        <Radio.Group>
                            {mapData.Players.map( ( p, i ) => <Radio value={p.Name} key={i}>{p.Name}</Radio> )}
                        </Radio.Group>
                    </Form.Item>
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