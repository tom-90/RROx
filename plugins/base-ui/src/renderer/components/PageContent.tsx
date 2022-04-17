import React from "react";
import { Layout } from "antd";

export function PageContent( { children }: { children?: React.ReactNode }) {
    return <Layout.Content className='page-content'>
        {children}
    </Layout.Content>;
}