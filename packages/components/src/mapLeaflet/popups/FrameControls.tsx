import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { Button } from "antd";
import { CompressOutlined, ExpandOutlined, ControlOutlined } from "@ant-design/icons";
import { Frame } from '@rrox/types';
import { DraggableModal } from 'ant-design-draggable-modal';
import { EngineControls } from '@rrox/types';
import { MapContext } from '../context';
import { FrameControls } from '../../components/frameControls';

export function FrameControlsPopup( {
    className,
    title,
    data,
    id,
    isVisible,
    isEngine,
    onClose,
    controlEnabled
}: {
    className?: string,
    title: string,
    data: Frame,
    id: number,
    isVisible: boolean,
    isEngine: boolean,
    onClose: () => void, controlEnabled: boolean
} ) {
    const { actions } = useContext( MapContext );
    const [ compact, setCompact ] = useState( false );

    const openExternal = () => {
        let location = window.location.href;
        let page = `controls/${id}`;
        window.open(location.endsWith("/") ? location + page : location + `/` + page, '_blank').focus();
    };

    const setEngineControls = useCallback( ( type: EngineControls, value: number ) => {
        actions.setEngineControls( id, type, value );
    }, [ actions.setEngineControls, id ] );

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
            {isEngine && <Button
                type='text'
                style={{ marginLeft: 10, padding: 5 }}
                onClick={() => openExternal()}
                title="Open controls in new window"
            >
                <ControlOutlined />
            </Button>}
        </>}
        visible={isVisible}
        className={className}
        footer={null}
        onCancel={onClose}
        initialWidth={800}
        initialHeight={450}
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
            isEngine={isEngine}
            setEngineControls={setEngineControls}
            compact={compact}
            controlEnabled={controlEnabled}
        />
    </DraggableModal>;
}