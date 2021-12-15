import React, { useState, useEffect, useContext, createRef } from 'react';
import { Button } from 'antd';
import { MapProperties } from './interfaces';
import { Frame as FrameData } from "../../../shared/data";
import { FrameControls } from './FrameControls';
import { MapTooltip } from './Tooltip';
import { MapContext } from './context';

const FrameColors: { [ vehicle: string ]: string } = {
    handcar: 'white',
    porter_040: 'black',
    porter_042: 'black',
    eureka: 'black',
    eureka_tender: 'black',
    climax: 'black',
    heisler: 'black',
    class70: 'black',
    class70_tender: 'black',
    cooke260: 'black',
    cooke260_tender: 'black',
    flatcar_logs: 'indianred',
    flatcar_cordwood: 'orange',
    flatcar_stakes: 'greenyellow',
    flatcar_hopper: 'rosybrown',
    boxcar: 'mediumpurple',
    flatcar_tanker: 'lightgray',
}

export const Frame = React.memo( function( { data, map, index }: { data: FrameData, map: MapProperties, index: number } ) {
    const { followElement, stopFollowing, following, minimap, controlEnabled } = useContext( MapContext );
    const engineRef = createRef<SVGPathElement>();

    const [ controlsVisible, setControlsVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const { Type, Location, Rotation, Name, Number, ID } = data;
    const { imx, minX, imy, minY, scale } = map;

    const radius = 6 * scale;

    const x = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) );
    const y = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) );

    const isEngine = [ 'porter_040', 'porter_042', /*'handcar', */'eureka', 'climax', 'heisler', 'class70', 'cooke260' ].includes( Type );

    useEffect( () => {
        if( !isEngine || !following || following.type !== 'frame' || following.index !== index || ( following.data === data && following.element === engineRef.current ) )
            return;
        followElement( 'frame', index, engineRef.current, data );
    }, [ engineRef.current, data, following ] );

    if( isEngine ) {
        const yl = ( radius / 3 ) * 2;
        const xl = ( radius / 2 ) * 2;

        return <MapTooltip
            title={`${Name.toUpperCase()}${Number ? ' - ' : ''}${Number.toUpperCase() || ''}`}
            controls={<>
                <Button onClick={() => {
                    setTooltipVisible( false );
                    setControlsVisible( true );
                }}>Open Controls</Button>
                <Button
                    style={{ marginTop: 5 }}
                    onClick={() => {
                        if( following && following.type === 'frame' && following.index === index )
                            stopFollowing();
                        else
                            followElement( 'frame', index, engineRef.current, data );
                        setTooltipVisible( false );
                    }}
                >
                    {following && following.type === 'frame' && following.index === index ? 'Unfollow' : 'Follow'}
                </Button>
            </>}
            visible={tooltipVisible && !minimap}
            setVisible={setTooltipVisible}
        >
            <path
                transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
                d={"M" + ( x - ( radius / 2 ) ) + "," + y + " l " + ( xl / 3 ) + "," + ( yl / 2 ) + " l " + ( xl / 3 * 2 ) + ",0 l 0,-" + yl + " l -" + ( xl / 3 * 2 ) + ",0 z"}
                fill="purple"
                stroke="black"
                strokeWidth={2}
                className={'clickable highlight'}
                ref={engineRef}
            />
            <FrameControls
                title={`${Name.toUpperCase()}${Number ? ' - ' : ''}${Number.toUpperCase() || ''}`}
                data={data}
                id={ID}
                isVisible={controlsVisible && !minimap}
                controlEnabled={controlEnabled}
                onClose={() => {
                    setControlsVisible( false );
                    setTooltipVisible( false );
                }}
            />
        </MapTooltip>;
    }

    const yl = ( radius / 3 ) * 2;
    let xl = radius;

    if ( Type.toLowerCase().includes( 'tender' ) )
        xl = xl / 3 * 2;

    let cx = x + Math.cos( Rotation[ 1 ] * ( Math.PI / 180 ) ) * 2;
    let cy = y + Math.sin( Rotation[ 1 ] * ( Math.PI / 180 ) ) * 2;

    return <path
        d={"M" + x + "," + y + " m-" + ( xl / 2 ) + ",-" + ( yl / 2 ) + " h" + ( xl - 4 ) + " a2,2 0 0 1 2,2 v" + ( yl - 4 ) + " a2,2 0 0 1 -2,2 h-" + ( xl - 4 ) + " a2,2 0 0 1 -2,-2 v-" + ( yl - 4 ) + " a2,2 0 0 1 2,-2 z"}
        fill={FrameColors[ Type ]}
        stroke="black"
        strokeWidth={1}
        transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + cx.toFixed( 2 ) + ", " + cy.toFixed( 2 ) + ")"}
    />;
} );