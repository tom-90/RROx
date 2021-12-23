import React from 'react';
import { Layout } from "antd";
import { ReactNode } from "react";
import { TopNav } from "./TopNav";

export function PageLayout( { children, style }: { children?: ReactNode, style?: any } ) {
    return <Layout style={{ height: '100%', background: window.mode === 'overlay' ? 'none' : undefined }}>
        {window.mode === 'normal' && <Layout.Header style={{ padding: 0 }}>
            <TopNav />
        </Layout.Header>}
        <Layout.Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ...style }}>
            {children}
        </Layout.Content>
    </Layout>;
}