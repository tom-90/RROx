import React, { useState, useEffect, useCallback } from "react";
import { useRPC, useListener } from "@rrox/api";
import { Button, notification } from "antd";
import { useNavigate } from "react-router";
import { IPlugin } from "../../bootstrap/plugins";
import { PluginsCommunicator } from "../../../shared";

export function UpdateNotify( { children }: { children?: React.ReactNode } ): React.ReactElement {
    const [ notifiedPackages, setNotifiedPackages ] = useState<string[]>( [] );

    const getPlugins = useRPC( PluginsCommunicator );
    const navigate = useNavigate();

    const notify = useCallback( ( plugins: IPlugin[] ) => {
        let notified: string[] = [];
        for( let plugin of plugins ) {
            if( !plugin.hasUpdate || notifiedPackages.includes( plugin.name ) )
                continue;

            const key = `notify-plugin-update-${plugin.name}`;

            notification.info( {
                key,
                message: 'Plugin update available',
                description: `An update is available for the plugin: ${plugin.description ? `${plugin.description} (${plugin.name})` : plugin.name}`,
                placement: 'bottomRight',
                duration: 0,
                btn: <Button
                    type='primary'
                    onClick={() => {
                        notification.close( key );
                        navigate( `/@rrox/electron/plugins/${encodeURIComponent( plugin.name )}`)
                    }}
                >
                    Open Plugin Page
                </Button>
            } );
            notified.push( plugin.name );
        }

        setNotifiedPackages( [ ...notifiedPackages, ...notified ] );
    }, [ notifiedPackages ] );

    useListener( PluginsCommunicator, ( installed ) => {
        notify( Object.values( installed ) );
    } );

    useEffect( () => {
        getPlugins().then( ( [ installed ] ) => {
            notify( Object.values( installed ) );
        } );
    }, [] );

    return children as React.ReactElement || null;
}