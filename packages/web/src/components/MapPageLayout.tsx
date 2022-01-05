import React from 'react';
import { Layout } from "antd";
import { ReactNode } from "react";
import { MapNav } from "./MapNav";

export function MapPageLayout( { children, style }: { children?: ReactNode, style?: any } ) {
    return <Layout style={{ height: '100%' }}>
        <Layout.Header style={{ padding: 0 }}>
            <MapNav />
        </Layout.Header>
        <Layout.Content style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ...style }}>
            {children}
        </Layout.Content>
    </Layout>;
}