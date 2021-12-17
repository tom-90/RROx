import React, { useState, useEffect, useContext, createRef } from 'react';
import { Button } from 'antd';
import { MapProperties } from './interfaces';
import { Frame as FrameData } from "../../../shared/data";
import { Cars } from '../../../shared/cars';
import { FrameControls } from './FrameControls';
import { MapTooltip } from './Tooltip';
import { MapContext } from './context';
import { StorageInfo } from './StorageInfo';

import Handcar from '../../../../assets/images/cars/handcar.png';
import Porter from '../../../../assets/images/cars/porter_040.png';
import Porter2 from '../../../../assets/images/cars/porter_042.png';
import Eureka from '../../../../assets/images/cars/eureka.png';
import EurekaTender from '../../../../assets/images/cars/eureka_tender.png';
import Climax from '../../../../assets/images/cars/climax.png';
import Heisler from '../../../../assets/images/cars/heisler.png';
import Class70 from '../../../../assets/images/cars/class70.png';
import Class70Tender from '../../../../assets/images/cars/class70_tender.png';
import Cooke260 from '../../../../assets/images/cars/cooke260.png';
import Cooke260Tender from '../../../../assets/images/cars/cooke260_tender.png';
import FlatcarLogs from '../../../../assets/images/cars/flatcar_logs.png';
import FlatcarCordwood from '../../../../assets/images/cars/flatcar_cordwood.png';
import FlatcarStakes from '../../../../assets/images/cars/flatcar_stakes.png';
import Hopper from '../../../../assets/images/cars/flatcar_hopper.png';
import Tanker from '../../../../assets/images/cars/flatcar_tanker.png';
import Boxcar from '../../../../assets/images/cars/boxcar.png';

const FrameInfo: { [ car: string ]: { color: string, image: string, name: string } } = {
    [ Cars.HANDCAR          ]: { color: 'white'      , image: Handcar        , name: 'Handcar' },
    [ Cars.PORTER           ]: { color: 'black'      , image: Porter         , name: 'Porter' },
    [ Cars.PORTER2          ]: { color: 'black'      , image: Porter2        , name: 'Porter 2' },
    [ Cars.EUREKA           ]: { color: 'black'      , image: Eureka         , name: 'Eureka' },
    [ Cars.EUREKA_TENDER    ]: { color: 'black'      , image: EurekaTender   , name: 'Eureka Tender' },
    [ Cars.CLIMAX           ]: { color: 'black'      , image: Climax         , name: 'Climax' },
    [ Cars.HEISLER          ]: { color: 'black'      , image: Heisler        , name: 'Heisler' },
    [ Cars.CLASS70          ]: { color: 'black'      , image: Class70        , name: 'Class 70' },
    [ Cars.CLASS70_TENDER   ]: { color: 'black'      , image: Class70Tender  , name: 'Class 70 Tender' },
    [ Cars.COOKE260         ]: { color: 'black'      , image: Cooke260       , name: 'Cooke Mogul' },
    [ Cars.COOKE260_TENDER  ]: { color: 'black'      , image: Cooke260Tender , name: 'Cooke Mogul Tender' },
    [ Cars.FLATCAR_LOGS     ]: { color: 'indianred'  , image: FlatcarLogs    , name: 'Flatcar Tier 1' },
    [ Cars.FLATCAR_CORDWOOD ]: { color: 'orange'     , image: FlatcarCordwood, name: 'Flatcar Tier 2' },
    [ Cars.FLATCAR_STAKES   ]: { color: 'greenyellow', image: FlatcarStakes  , name: 'Flatcar Tier 3' },
    [ Cars.HOPPER           ]: { color: 'rosybrown'  , image: Hopper         , name: 'Hopper' },
    [ Cars.TANKER           ]: { color: 'lightgray'  , image: Tanker         , name: 'Tanker' },
    [ Cars.BOXCAR           ]: { color: 'gray'       , image: Boxcar         , name: 'Boxcar' },
};

const getStrokeColor = ( brake: number ) => {
    if( brake > 0.5 )
        return 'red';
    else if( brake > 0.2 )
        return 'orange';
    else
        return 'black';
};

export const Frame = React.memo( function( { data, map, index }: { data: FrameData, map: MapProperties, index: number } ) {
    const { followElement, stopFollowing, following, minimap, controlEnabled } = useContext( MapContext );
    const engineRef = createRef<SVGPathElement>();

    const [ controlsVisible, setControlsVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const { Type, Location, Rotation, Name, Number, ID, Brake } = data;
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
                <img src={FrameInfo[ Type ]?.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }}/>
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
                stroke={getStrokeColor( Brake )}
                strokeWidth={1}
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

    return <MapTooltip
        title={FrameInfo[ Type ]?.name || 'Freight Car'}
        controls={<>
            <img src={FrameInfo[ Type ]?.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }}/>
            {data.Freight && <Button onClick={() => {
                setTooltipVisible( false );
                setControlsVisible( true );
            }}>Show Freight</Button>}
        </>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <path
            d={"M" + x + "," + y + " m-" + ( xl / 2 ) + ",-" + ( yl / 2 ) + " h" + ( xl - 4 ) + " a2,2 0 0 1 2,2 v" + ( yl - 4 ) + " a2,2 0 0 1 -2,2 h-" + ( xl - 4 ) + " a2,2 0 0 1 -2,-2 v-" + ( yl - 4 ) + " a2,2 0 0 1 2,-2 z"}
            fill={FrameInfo[ Type ]?.color}
            className={'clickable highlight'}
            stroke={getStrokeColor( Brake )}
            strokeWidth={0.5}
            transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + cx.toFixed( 2 ) + ", " + cy.toFixed( 2 ) + ")"}
        />
        <StorageInfo
            title={FrameInfo[ Type ]?.name || 'Freight Car'}
            storages={{
                Freight: data.Freight ? [ data.Freight ] : []
            }}
            isVisible={controlsVisible && !minimap}
            onClose={() => {
                setControlsVisible( false );
                setTooltipVisible( false );
            }}
        />
    </MapTooltip>;
} );