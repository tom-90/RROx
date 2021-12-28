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
import Caboose from '../../../../assets/images/cars/caboose.png';

const FrameInfo: { [ car: string ]: { image: string, name: string, length: number } } = {
    [ Cars.HANDCAR          ]: { image: Handcar        , length: 4.202, name: 'Handcar' },
    [ Cars.PORTER           ]: { image: Porter         , length: 3.912, name: 'Porter' },
    [ Cars.PORTER2          ]: { image: Porter2        , length: 4.614, name: 'Porter 2' },
    [ Cars.EUREKA           ]: { image: Eureka         , length: 8.021, name: 'Eureka' },
    [ Cars.EUREKA_TENDER    ]: { image: EurekaTender   , length: 4.971, name: 'Eureka Tender' },
    [ Cars.CLIMAX           ]: { image: Climax         , length: 8.499, name: 'Climax' },
    [ Cars.HEISLER          ]: { image: Heisler        , length: 9.137, name: 'Heisler' },
    [ Cars.CLASS70          ]: { image: Class70        , length: 9.389, name: 'Class 70' },
    [ Cars.CLASS70_TENDER   ]: { image: Class70Tender  , length: 6.788, name: 'Class 70 Tender' },
    [ Cars.COOKE260         ]: { image: Cooke260       , length: 8.378, name: 'Cooke Mogul' },
    [ Cars.COOKE260_TENDER  ]: { image: Cooke260Tender , length: 6.417, name: 'Cooke Mogul Tender' },
    [ Cars.FLATCAR_LOGS     ]: { image: FlatcarLogs    , length: 7.856, name: 'Flatcar Tier 1' },
    [ Cars.FLATCAR_STAKES   ]: { image: FlatcarStakes  , length: 7.856, name: 'Flatcar Tier 2' },
    [ Cars.FLATCAR_CORDWOOD ]: { image: FlatcarCordwood, length: 7.856, name: 'Flatcar Tier 3' },
    [ Cars.HOPPER           ]: { image: Hopper         , length: 7.856, name: 'Hopper' },
    [ Cars.TANKER           ]: { image: Tanker         , length: 7.856, name: 'Tanker' },
    [ Cars.BOXCAR           ]: { image: Boxcar         , length: 8.228, name: 'Boxcar' },
    [ Cars.CABOOSE          ]: { image: Caboose        , length: 6.096, name: 'Caboose' },
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
    const [ storageVisible, setStorageVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );

    const { Type, Location, Rotation, Name, Number, ID, Brake } = data;
    const { imx, minX, imy, minY, scale } = map;

    let x = ( imx - ( ( Location[ 0 ] - minX ) / 100 * scale ) );
    let y = ( imy - ( ( Location[ 1 ] - minY ) / 100 * scale ) );

    const isEngine = [ 'porter_040', 'porter_042', 'handcar', 'eureka', 'climax', 'heisler', 'class70', 'cooke260' ].includes( Type );

    useEffect( () => {
        if( !isEngine || !following || following.type !== 'frame' || following.index !== index || ( following.data === data && following.element === engineRef.current ) )
            return;
        followElement( 'frame', index, engineRef.current, data );
    }, [ engineRef.current, data, following ] );

    const yl = 5.70;
    const xl = ( ( FrameInfo[ Type ]?.length || 5 ) - 0.6 ) * 2;

    if( isEngine )
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
                <Button
                    style={{ marginTop: 5 }}
                    onClick={() => {
                        window.ipc.send( 'teleport', data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] + 500 )
                    }}
                >Teleport Here</Button>
            </>}
            visible={tooltipVisible && !minimap}
            setVisible={setTooltipVisible}
        >
            <path
                transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
                d={"M" + ( x - ( xl / 2 ) ) + "," + y + " l " + ( xl / 3 ) + "," + ( yl / 2 ) + " l " + ( xl / 3 * 2 ) + ",0 l 0,-" + yl + " l -" + ( xl / 3 * 2 ) + ",0 z"}
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
                isVisible={controlsVisible}
                className={minimap ? 'modal-hidden' : undefined}
                controlEnabled={controlEnabled}
                isEngine={true}
                onClose={() => {
                    setControlsVisible( false );
                    setTooltipVisible( false );
                }}
            />
        </MapTooltip>;

    return <MapTooltip
        title={FrameInfo[ Type ]?.name || 'Freight Car'}
        controls={<>
            <img src={FrameInfo[ Type ]?.image} width={100} height={100} style={{ margin: '-10px auto 20px auto' }}/>
            <Button onClick={() => {
                    setTooltipVisible( false );
                    setControlsVisible( true );
                }}>Open Controls</Button>
            {data.Freight && <Button
                style={{ marginTop: 5 }}
                onClick={() => {
                    setTooltipVisible( false );
                    setStorageVisible( true );
                }}
            >Show Freight</Button>}
            {Type === Cars.CABOOSE && <Button
                style={{ marginTop: 5 }}
                onClick={() => {
                    window.ipc.send( 'teleport', data.Location[ 0 ], data.Location[ 1 ], data.Location[ 2 ] )
                }}
            >Teleport Here</Button>}
        </>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <path
            d={"M" + x + "," + y + " m-" + ( xl / 2 - 2 ) + ",-" + ( yl / 2 ) + " h" + ( xl - 4 ) + " a2,2 0 0 1 2,2 v" + ( yl - 4 ) + " a2,2 0 0 1 -2,2 h-" + ( xl - 4 ) + " a2,2 0 0 1 -2,-2 v-" + ( yl - 4 ) + " a2,2 0 0 1 2,-2 z"}
            fill={window.settingsStore.get( `colors.${Type}.${data.Freight && data.Freight.Amount > 0 ? 'loaded' : 'unloaded'}` )}
            className={'clickable highlight'}
            stroke={getStrokeColor( Brake )}
            strokeWidth={0.5}
            transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x.toFixed( 2 ) + ", " + y.toFixed( 2 ) + ")"}
        />
        <StorageInfo
            title={FrameInfo[ Type ]?.name || 'Freight Car'}
            className={minimap ? 'modal-hidden' : undefined}
            storages={{
                Freight: data.Freight ? [ data.Freight ] : []
            }}
            isVisible={storageVisible}
            onClose={() => {
                setStorageVisible( false );
                setTooltipVisible( false );
            }}
        />
        <FrameControls
            title={FrameInfo[ Type ]?.name || 'Freight Car'}
            data={data}
            id={ID}
            isVisible={controlsVisible}
            className={minimap ? 'modal-hidden' : undefined}
            isEngine={false}
            controlEnabled={controlEnabled}
            onClose={() => {
                setControlsVisible( false );
                setTooltipVisible( false );
            }}
        />
    </MapTooltip>;
} );