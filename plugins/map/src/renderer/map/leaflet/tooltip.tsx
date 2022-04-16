import React, { useRef, useEffect, useMemo } from 'react';
import { Popup, Pane, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Divider } from 'antd';

export function MapTooltip( { title, children, visible, position, setVisible }: {
    title?: string,
    children?: React.ReactNode,
    position?: L.LatLngExpression,
    visible: boolean,
    setVisible: ( visible: boolean ) => void
} ) {
    const map = useMap();
    const ref = useRef<L.Popup>();

    useEffect( () => {
        if( visible && !ref.current!.isOpen() ) {
            ref.current!.openOn( map );
        } else if( !visible && ref.current!.isOpen() ) {
            // @ts-expect-error
            ref.current._closeButton.click();
        }
    }, [ visible ] );

    const { onOpen, onClose } = useMemo( () => ( { onOpen: () => setVisible( true ), onClose: () => setVisible( false ) } ), [] );

    return <Popup pane='popups' ref={ref as React.Ref<L.Popup>} onOpen={onOpen} onClose={onClose} position={position}>
        <div style={{ margin: '0 10px 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {title && <Divider orientation={'center'} style={{ margin: '0 0 10px 0' }}>{title}</Divider>}
            {children}
        </div>
    </Popup>;
}