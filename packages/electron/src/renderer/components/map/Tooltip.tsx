import React, { useState } from 'react';
import { Tooltip, Divider } from 'antd';

export function MapTooltip( { title, children, controls, visible, setVisible }: { 
    title: string,
    children?: React.ReactNode, 
    controls: React.ReactNode, 
    visible: boolean, 
    setVisible: ( visible: boolean ) => void
} ) {
    return <Tooltip
        title={<div style={{ margin: '0 10px 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Divider orientation={'center'} style={{ margin: '0 0 10px 0' }}>{title}</Divider>
            {controls}
        </div>}
        trigger={'click'}
        onVisibleChange={setVisible}
        color={'#fff'}
        zIndex={900}
        visible={visible}
    >
        <g className={visible ? 'tooltipControls' : undefined}>
            {children}
        </g>
    </Tooltip>
}