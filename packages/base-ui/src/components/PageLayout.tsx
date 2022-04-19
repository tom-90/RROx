import React, { useCallback, useState } from 'react';
import { Layout } from "antd";
import { ReactNode } from "react";
import { RendererMode, useMode } from '@rrox/api';
import { SideNav } from './SideNav';

export function PageLayout( { children, style }: { children?: ReactNode, style?: any } ) {
    const mode = useMode();
    const [ collapsed, setCollapsedState ] = useState( window.sessionStorage.getItem( 'sidebar.collapsed' ) === 'true' );

    const setCollapsed = useCallback( ( value: boolean ) => {
        setCollapsedState( value );
        window.sessionStorage.setItem( 'sidebar.collapsed', value.toString() );
    }, [] );

    return <Layout style={{ height: '100%', background: mode === RendererMode.OVERLAY ? 'none' : undefined }}>
        <Layout.Sider
            breakpoint='xxl'
            collapsed={collapsed}
            onBreakpoint={setCollapsed}
            collapsible
            onCollapse={setCollapsed}
        >
            <SideNav />
        </Layout.Sider>
        <Layout.Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ...style }}>
            {children}
        </Layout.Content>
    </Layout>;
}