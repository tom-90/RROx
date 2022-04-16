import React, { useRef, useState, useContext } from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import { usePositions } from './positions';
import { MapContext } from '../context';
import { Line } from '../leaflet';

export function useImageAdjust( initialPoints: [ [ number, number ], [ number, number ], [ number, number ] ], anchor: [ number, number ], rotation: number ) {
    const { utils } = useContext( MapContext )!;

    const markers = [
        useRef<L.Marker>(),
        useRef<L.Marker>(),
        useRef<L.Marker>()
    ] as const;

    const [ configuredPoints, setPoints ] = useState( initialPoints );


    const onDragEnd = ( markerIndex: number ) => {
        let markerPoint = markers[ markerIndex ].current!.getLatLng();
        let rotatedPoint = utils.rotate( anchor[ 0 ], anchor[ 1 ], markerPoint.lat, markerPoint.lng, -rotation );
        let newPoints = [ ...configuredPoints ] as typeof initialPoints;
        newPoints[ markerIndex ] = [ rotatedPoint[ 0 ] - anchor[ 0 ], rotatedPoint[ 1 ] - anchor[ 1 ] ];
        setPoints( newPoints );

        console.log( [
            utils.revertScalePoint( ...newPoints[ 0 ] ),
            utils.revertScalePoint( ...newPoints[ 1 ] ),
            utils.revertScalePoint( ...newPoints[ 2 ] )
        ])
    }

    const points = usePositions( configuredPoints, anchor, rotation );

    const lineExtensions = usePositions( [
        [ -utils.scaleNumber( 20000 ), 0 ],
        [ +utils.scaleNumber( 20000 ), 0 ],
        [ 0, -utils.scaleNumber( 20000 ) ],
        [ 0, +utils.scaleNumber( 20000 ) ],
    ], points[ 0 ], rotation );

    return {
        points,
        markers: <>
            <Marker
                position={points[ 0 ]}
                draggable
                pane={'popups'}
                title='Top Left'
                ref={markers[ 0 ] as React.Ref<L.Marker>}
                eventHandlers={{
                    dragend: () => onDragEnd( 0 ),
                }}
            />
            <Marker
                position={points[ 1 ]}
                title='Top Right'
                pane={'popups'}
                draggable
                ref={markers[ 1 ] as React.Ref<L.Marker>}
                eventHandlers={{
                    dragend: () => onDragEnd( 1 ),
                }}
            />
            <Marker
                position={points[ 2 ]}
                draggable
                title='Bottom Left'
                pane={'popups'}
                ref={markers[ 2 ] as React.Ref<L.Marker>}
                eventHandlers={{
                    dragend: () => onDragEnd( 2 ),
                }}
            />
            <Line
                pane={'popups'}
                positions={[
                    [
                        lineExtensions[ 0 ],
                        lineExtensions[ 1 ],
                    ],
                    [
                        lineExtensions[ 2 ],
                        lineExtensions[ 3 ],
                    ]
                ]}
                color={'black'}
                weight={500}
            />
        </>
    }
}