import React, { useState } from "react";
import { PageLayout, PageContent } from "@rrox/base-ui";
import { SettingsTree } from "./tree";
import { Layout, Col, Row, Empty } from "antd";

export function SettingsPage() {
    const [ selectedPage, setSelectedPage ] = useState<{ key: string, element: React.ReactElement } | undefined>( undefined ); 

    return <PageLayout>
        <PageContent>
            <Row style={{ height: '100%' }}>
                <Col span={8} style={{ height: '100%' }}>
                    <SettingsTree
                        selected={selectedPage}
                        onSelected={setSelectedPage}
                    />
                </Col>
                <Col span={16} style={{ height: '100%' }}>
                    <div style={{
                        margin: '5px 15px',
                        padding: '0 10px',
                        borderLeft: '1px solid #c7c7c7',
                        height: 'calc(100% - 20px)',
                        overflowY: 'auto',
                    }}>
                        {selectedPage?.element || <Empty description='Choose settings from the menu'/>}
                    </div>
                </Col>
            </Row>
        </PageContent>
    </PageLayout>;
}