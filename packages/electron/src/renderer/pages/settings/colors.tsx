import { CopyOutlined } from '@ant-design/icons';
import { ColorSettings } from '@rrox/components';
import { Button, Input, Modal, Tooltip, FormInstance } from 'antd';
import React from 'react';

export function ColorsSettings( { form }: { settings: any, form: FormInstance } ) {
    const resetColor = ( ...keys: string[] ) => {
        keys.forEach( ( k ) => window.settingsStore.reset( k ) );
        form.setFieldsValue( window.settingsStore.getAll() );

        window.ipc.send( 'update-config' );
    };

    return <ColorSettings
        resetToDefault={resetColor}
        minizwergSharing={<tr>
            <td>
                <span>Share with Minizwerg:</span>
            </td>
            <td>
                <Button
                    type="default"
                    className='minizwerg'
                    onClick={() => {
                        window.ipc.invoke( 'minizwerg-colors', true ).then( ( code ) => {
                            if ( !code )
                                return;
                            Modal.info( {
                                title: 'Share the following code with others:',
                                icon: null,
                                content: <Input.Group compact>
                                    <Input
                                        style={{ width: 'calc(100% - 50px)' }}
                                        value={code}
                                        readOnly
                                    />
                                    <Tooltip title="Copy Code">
                                        <Button
                                            icon={<CopyOutlined />}
                                            onClick={() => {
                                                navigator.clipboard.writeText( code );
                                            }}
                                        />
                                    </Tooltip>
                                </Input.Group>
                            } );
                        } ).catch( ( e ) => {
                            console.error( e );
                        } );
                    }}
                >
                    Share color scheme
                </Button>
            </td>
            <td>
                <Button
                    type="default"
                    className='minizwerg'
                    onClick={() => {
                        let code: string = '';

                        Modal.confirm( {
                            title: 'Enter the share code:',
                            icon: null,
                            content: <Input
                                style={{ width: 'calc(100% - 50px)' }}
                                onChange={( v ) => code = v.target.value}
                            />,
                            onOk: () => {
                                window.ipc.invoke( 'minizwerg-colors', false, code ).then( () => {
                                    form.setFieldsValue( window.settingsStore.getAll() );
                                } ).catch( ( e ) => {
                                    console.error( e );
                                } );
                            }
                        } );
                    }}
                >
                    Import color scheme
                </Button>
            </td>
        </tr>}
    />;
}