import React, { useState, useContext } from 'react';
import { Button } from "antd";
import { CompressOutlined, ExpandOutlined, ControlOutlined } from "@ant-design/icons";
import { DraggableModal } from 'ant-design-draggable-modal';
import { MapContext } from '../context';
import { FrameControls } from '../components';
import { FrameDefinitions } from '../definitions';
import { MapMode } from '../types';
import { IFrameCar } from '@rrox/world/shared';

export function FrameControlsPopup( {
    className,
    title,
    data,
    index,
    frames,
    isVisible,
    onClose,
    controlEnabled
}: {
    className?: string,
    title: string,
    data: IFrameCar,
    frames: IFrameCar[],
    index: number,
    isVisible: boolean,
    onClose: () => void, controlEnabled: boolean
} ) {
    const { mode } = useContext( MapContext )!;
    const [ compact, setCompact ] = useState( false );

    const definition = FrameDefinitions[ data.type ];
    const isEngine = definition.engine;

    return <DraggableModal
        title={<>
            {title}
            {isEngine && <Button
                type='text'
                style={{ marginLeft: 10, padding: 5 }}
                onClick={() => setCompact( !compact )}
                title={compact ? "Switch to advanced view" : "Switch to compact view"}
            >
                {compact ? <ExpandOutlined /> : <CompressOutlined />}
            </Button>}
            {isEngine && mode === MapMode.NORMAL && <Button
                type='text'
                style={{ marginLeft: 10, padding: 5 }}
                onClick={() => null}
                title="Open controls"
            >
                <ControlOutlined />
            </Button>}
        </>}
        visible={isVisible}
        className={[ className || '', 'frame-controls-modal' ].join( ' ' )}
        footer={null}
        onCancel={onClose}
        initialWidth={800}
        initialHeight={550}
        zIndex={2000}
        modalRender={( content ) => {
            if ( !React.isValidElement( content ) )
                return;
            return React.cloneElement( content, {
                onClick: ( e: React.MouseEvent ) => {
                    e.stopPropagation();
                }
            } as any );
        }}
    >
        <FrameControls
            index={index}
            data={data}
            compact={compact}
            controlEnabled={controlEnabled}
            frames={frames}
        />
    </DraggableModal>;
}