import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { Button } from "antd";
import { CompressOutlined, ExpandOutlined, ControlOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { Frame } from '@rrox/types';
import { DraggableModal } from 'ant-design-draggable-modal';
import { MapContext, MapMode, GamepadSettings } from '../context';
import { FrameControls } from '../../components/frameControls';
import { FrameDefinitions } from '../definitions/Frame';

export function FrameControlsPopup( {
    className,
    title,
    data,
    frames,
    id,
    isVisible,
    onClose,
    controlEnabled,
    gamepadSettings
}: {
    className?: string,
    title: string,
    data: Frame,
    frames: Frame[],
    id: number,
    isVisible: boolean,
    onClose: () => void,
    controlEnabled: boolean
    gamepadSettings: GamepadSettings
} ) {
    const { actions, mode } = useContext( MapContext );
    const [ compact, setCompact ] = useState( false );

    const definition = FrameDefinitions[ data.Type ];
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
                onClick={() => actions.openControlsExternal( id )}
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
                onClick: ( e: React.SyntheticEvent ) => {
                    e.stopPropagation();
                }
            } );
        }}
    >
        <FrameControls
            data={data}
            setEngineControls={actions.setEngineControls}
            setControlsSynced={actions.setControlsSynced}
            compact={compact}
            controlEnabled={controlEnabled}
            frames={frames}
            gamepadSettings={gamepadSettings}
        />
    </DraggableModal>;
}