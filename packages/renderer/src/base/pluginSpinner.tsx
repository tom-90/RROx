import { PageContent, PageLayout } from "@rrox/base-ui";
import React, { useState, useEffect } from "react";
import { PluginManager } from "../bootstrap";
import { Spin } from "antd";

export function PluginSpinner( { manager, children }: { manager: PluginManager, children?: React.ReactElement } ) {
    const [ loading, setLoading ] = useState( manager.isLoading );

    useEffect( () => {
        const listener = () => {
            setLoading( manager.isLoading );
        };

        manager.addListener( 'loading', listener );

        return () => {
            manager.removeListener( 'loading', listener );
        }
    }, [ manager ] );

    if( !loading )
        return children!;

    return <PageLayout>
        <PageContent>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Spin tip='Initializing RROx...' />
            </div>
        </PageContent>
    </PageLayout>;
}