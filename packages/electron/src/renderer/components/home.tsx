import React from "react";
import { PageContent, PageLayout } from "@rrox/base-ui";
import AppIcon from "@rrox/assets/images/appIcon.ico";
import { Button, Spin, Steps, Typography } from "antd";
import { AppstoreOutlined, CheckCircleOutlined, FileSearchOutlined, LoginOutlined, LoadingOutlined } from "@ant-design/icons";
import { AttachCommunicator, AttachedCommunicator, AttachStatus, DetachCommunicator } from "../../shared";
import { useRPC, useValue } from "@rrox/api";

function Step( { step, currentStatus, icon, last, ...restProps }: {
    step: AttachStatus,
    currentStatus: AttachStatus,
    title: string,
    description?: string,
    last?: boolean,
    icon: React.ReactElement
} ) {
    return <Steps.Step
        {...restProps}
        status={currentStatus > step || ( currentStatus === step && last ) ? 'finish' : ( currentStatus === step ? 'process' : 'wait')}
        icon={currentStatus === step && !last ? <LoadingOutlined /> : icon}
    />;
}

export function HomePage() {
    const attach = useRPC( AttachCommunicator );
    const detach = useRPC( DetachCommunicator );
    const status = useValue( AttachedCommunicator );

    return <PageLayout>
        <PageContent style={{ maxWidth: 900 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <img width={100} src={AppIcon} />
                <Typography.Title style={{ fontWeight: 'bold', color: '#303030', textAlign: 'center' }}>RailroadsOnline Extended</Typography.Title>
            </div>
    	    <p>
                RailroadsOnline Extended provides an in-game minimap, with the ability to remotely control switches and locomotives.
                In addition, RROx allows you to teleport to various locations and trigger autosaves.
            </p>
            <p>
                RROx attaches to the game using <a href={'https://wikipedia.org/wiki/DLL_injection'}>DLL injection</a>.
                This means that no game files are modified on disk. By closing RROx and restarting the game, the game will run completely unaffected.
                To start using RROx, click the attach button below.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '20px 0' }}>
                {status === AttachStatus.DETACHED && <Button type='primary' onClick={() => attach()}>Attach</Button>}
                {[ AttachStatus.INITIALIZING, AttachStatus.INJECTING, AttachStatus.LOADING_PLUGINS ].includes( status )
                    && <Spin><Button type='primary' disabled onClick={() => attach()}>Attach</Button></Spin>}
                {status === AttachStatus.ATTACHED && <Button onClick={() => detach()}>Detach</Button>}
            </div>
            <Steps style={{ padding: '20px 30px' }}>
                <Step currentStatus={status} step={AttachStatus.INJECTING} title='Attach' description="Inject RROx into the game" icon={<LoginOutlined />} />
                <Step currentStatus={status} step={AttachStatus.INITIALIZING} title="Initialize" description="Analyze game memory" icon={<FileSearchOutlined />} />
                <Step currentStatus={status} step={AttachStatus.LOADING_PLUGINS} title="Plugins" description="Load RROx plugins" icon={<AppstoreOutlined />} />
                <Step currentStatus={status} step={AttachStatus.ATTACHED} title="Done" icon={<CheckCircleOutlined />} last />
            </Steps>
        </PageContent>
    </PageLayout>;
}