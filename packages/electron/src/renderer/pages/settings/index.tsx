import React, { useState, useMemo } from 'react';
import { Collapse, Divider, Form } from 'antd';
import { PageLayout } from "../../components/PageLayout";
import { MapSettings } from './map';
import { MinimapSettings } from './minimap';
import { AutosaveSettings } from './autosave';
import { ColorsSettings } from './colors';
import { KeybindingsSettings } from './keybindings';
import { GamepadSettings } from './gamepad';
import { FeaturesSettings } from './features';
import { MinizwergSettings } from './minizwerg';
import { DebuggingSettings } from './debugging';
import './style.less';

export function Settings() {

    const [ form ] = Form.useForm();

    const [ settings, setSettings ] = useState( window.settingsStore.getAll() );
    
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
        <PageLayout style={{ overflowY: 'auto' }}>
            <div style={{ maxWidth: 1000, width: '100%', marginBottom: 20 }}>
                <Form
                    name="settings"
                    layout="vertical"
                    labelCol={{ span: 8, offset: 3 }}
                    wrapperCol={{ span: 16, offset: 3 }}
                    initialValues={settings}
                    form={form}
                    
                    onValuesChange={( changed ) => {
                        throttleOnValuesChange( changed, ( changedValues ) => {
                            for( let key in changedValues )
                                window.settingsStore.set( key, changedValues[ key ] );

                            setSettings( {
                                ...settings,
                                ...changedValues
                            } );

                            window.ipc.send( 'update-config' );
                        } );
                    }}
                    autoComplete="off"
                >
                    <Collapse ghost className='settings-collapse'>
                        <Collapse.Panel key={'map'} header={<Divider orientation="left">Map</Divider>}>
                            <MapSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='minimap' header={<Divider orientation="left">Minimap</Divider>}>
                            <MinimapSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='autosave' header={<Divider orientation="left">Autosave</Divider>}>
                            <AutosaveSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='colors' header={<Divider orientation="left">Colors</Divider>}>
                            <ColorsSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='keybindings' header={<Divider orientation="left">Keybindings</Divider>}>
                            <KeybindingsSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='gamepad' header={<Divider orientation="left">Gamepad</Divider>}>
                            <GamepadSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='features' header={<Divider orientation="left">Features</Divider>}>
                            <FeaturesSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='minizwerg' header={<Divider orientation="left">Minizwerg</Divider>}>
                            <MinizwergSettings form={form} settings={settings} />
                        </Collapse.Panel>
                        <Collapse.Panel key='debugging' header={<Divider orientation="left">Debugging</Divider>}>
                            <DebuggingSettings form={form} settings={settings} />
                        </Collapse.Panel>
                    </Collapse>
                </Form>
            </div>
        </PageLayout>
    );
}