import React, { useRef, useEffect } from 'react';
import { Popup, Pane, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Divider } from 'antd';

export function MapTooltip( { title, children, visible, setVisible }: { 
    title: string,
    children?: React.ReactNode, 
    visible: boolean, 
    setVisible: ( visible: boolean ) => void
} ) {
    const map = useMap();
    const ref = useRef<L.Popup>();

    useEffect( () => {
        if( visible && !ref.current.isOpen() ) {
            ref.current.openOn( map );
        } else if( !visible && ref.current.isOpen() ) {
            // @ts-expect-error
            ref.current._closeButton.click();
        }
    }, [ visible ] );

    return <Popup pane='popups' ref={ref} onOpen={() => setVisible( true )} onClose={() => setVisible( true )}>
        <div style={{ margin: '0 10px 10px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Divider orientation={'center'} style={{ margin: '0 0 10px 0' }}>{title}</Divider>
            {children}
        </div>
    </Popup>;
}