import { InteractiveLayerProps, createLayerComponent, updateMediaOverlay } from '@react-leaflet/core'
import React, { useRef } from 'react';
import L from 'leaflet';
import 'leaflet-imageoverlay-rotated';

export interface ImageProps extends L.ImageOverlayOptions, InteractiveLayerProps {
    topLeft: L.LatLngExpression;
    topRight: L.LatLngExpression;
    bottomLeft: L.LatLngExpression;
    url: string;
    children?: React.ReactNode;
}

const ImageRotated = createLayerComponent<
    L.ImageOverlay.Rotated,
    ImageProps
>(
    function createImageOverlay( { url, topLeft, topRight, bottomLeft, ...options }, ctx ) {
        const instance = L.imageOverlay.rotated( url, topLeft, topRight, bottomLeft, options );

        return { instance, context: { ...ctx, overlayContainer: instance } }
    },
    function updateImageOverlay( overlay, props, prevProps ) {
        updateMediaOverlay( overlay, props as any, prevProps as any )
        if ( props.url !== prevProps.url ) {
            overlay.setUrl( props.url )
        }
        if ( props.topLeft !== prevProps.topLeft || props.topRight !== prevProps.topRight || props.bottomLeft !== prevProps.bottomLeft ) {
            overlay.reposition( props.topLeft, props.topRight, props.bottomLeft )
        }
    },
)

export function Image( props: ImageProps ) {
    const ref = useRef<L.ImageOverlay.Rotated>();

    return <ImageRotated
        {...props}
        ref={ref}
        eventHandlers={{
            load: () => ref.current?.reposition( props.topLeft, props.topRight, props.bottomLeft ),
        }}
    />
}