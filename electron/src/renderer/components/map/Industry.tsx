import React, { useState, useContext } from 'react';
import { Button } from 'antd';
import { MapProperties } from './interfaces';
import { MapTooltip } from './Tooltip';
import { MapContext } from './context';
import { Industry as IndustryData } from "../../../shared/data";
import { IndustryType } from '../../../shared/industry';
import LoggingCamp from '../../../../assets/images/industries/Logging Camp.svg';
import Sawmill from '../../../../assets/images/industries/Sawmill.svg';
import FreightDepot from '../../../../assets/images/industries/Freight Depot.svg';
import Smelter from '../../../../assets/images/industries/Smelter.svg';
import IronMine from '../../../../assets/images/industries/Iron Mine.svg';
import CoalMine from '../../../../assets/images/industries/Coal Mine.svg';
import Refinery from '../../../../assets/images/industries/Refinery.svg';
import Ironworks from '../../../../assets/images/industries/Ironworks.svg';
import OilField from '../../../../assets/images/industries/Oil Field.svg';
import { StorageInfo } from './StorageInfo';

export const Industry = React.memo( function( { data, map }: { data: IndustryData, map: MapProperties, index: number } ) {
    const { Type, Location, Rotation } = data;
    const { imx, imy, minX, minY, scale } = map;

    const x = imx - ( ( Location[ 0 ] - minX ) / 100 * scale );
    const y = imy - ( ( Location[ 1 ] - minY ) / 100 * scale );

    const [ infoVisible, setInfoVisible ] = useState( false );
    const [ tooltipVisible, setTooltipVisible ] = useState( false );
    const { minimap } = useContext( MapContext );

    if( Type === IndustryType.FIREWOOD_DEPOT )
        return <MapTooltip
            title={'Firewood Depot'}
            controls={<Button onClick={() => {
                setTooltipVisible( false );
                setInfoVisible( true );
            }}>Show Info</Button>}
            visible={tooltipVisible && !minimap}
            setVisible={setTooltipVisible}
        >
            <path
                transform={"rotate(" + Math.round( Rotation[ 1 ] ) + ", " + x + ", " + y + ")"}
                d={"M" + x + "," + y + " m-18,-15 l10,0 l0,30 l-10,0 z"}
                fill="orange"
                stroke="brown"
                className={'clickable highlight'}
            />
            <StorageInfo
                title={'Firewood Depot'}
                storages={{
                    Input: data.Educts,
                    Output: data.Products
                }}
                isVisible={infoVisible && !minimap}
                onClose={() => {
                    setInfoVisible( false );
                    setTooltipVisible( false );
                }}
            />
        </MapTooltip>;

    let industry: { name: string, image: string, transform: string, width: number, height: number };

    if( Type === IndustryType.LOGGING_CAMP )
        industry = {
            name: 'Logging Camp',
            image: LoggingCamp,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) - 180}, ${x}, ${y}) translate(${x-50},${y-100})`,
            width: 190,
            height: 190,
        };
    else if( Type === IndustryType.SAWMILL )
        industry = {
            name: 'Sawmill',
            image: Sawmill,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) - 180}, ${x}, ${y}) translate(${x-110},${y-100})`,
            width: 220,
            height: 220,
        };
    else if( Type === IndustryType.FREIGHT_DEPOT )
        industry = {
            name: 'Freight Depot',
            image: FreightDepot,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) - 90}, ${x}, ${y}) translate(${x-97},${y-100})`,
            width: 200,
            height: 200,
        };
    else if( Type === IndustryType.SMELTER )
        industry = {
            name: 'Smelter',
            image: Smelter,
            transform: `rotate(${Math.round( Rotation[ 1 ] )}, ${x}, ${y}) translate(${x-80},${y-50})`,
            width: 155,
            height: 155,
        };
    else if( Type === IndustryType.IRONMINE )
        industry = {
            name: 'Iron Mine',
            image: IronMine,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) - 90}, ${x}, ${y}) translate(${x-25},${y-72})`,
            width: 120,
            height: 120,
        };
    else if( Type === IndustryType.COALMINE )
        industry = {
            name: 'Coal Mine',
            image: CoalMine,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) - 90}, ${x}, ${y}) translate(${x-70},${y-95})`,
            width: 120,
            height: 120,
        };
    else if( Type === IndustryType.REFINERY )
        industry = {
            name: 'Refinery',
            image: Refinery,
            transform: `rotate(${Math.round( Rotation[ 1 ] ) + 90}, ${x}, ${y}) translate(${x-125},${y-100})`,
            width: 200,
            height: 200,
        };
    else if( Type === IndustryType.IRONWORKS )
        industry = {
            name: 'Ironworks',
            image: Ironworks,
            transform: `rotate(${Math.round( Rotation[ 1 ] )}, ${x}, ${y}) translate(${x-100},${y-65})`,
            width: 170,
            height: 170,
        };
    else if( Type === IndustryType.OILFIELD )
        industry = {
            name: 'Oil Field',
            image: OilField,
            transform: `rotate(${Math.round( Rotation[ 1 ] )}, ${x}, ${y}) translate(${x-220},${y-190})`,
            width: 350,
            height: 350,
        };
    else
        return null;

    
    return <MapTooltip
        title={industry.name}
        controls={<Button onClick={() => {
            setTooltipVisible( false );
            setInfoVisible( true );
        }}>Show Info</Button>}
        visible={tooltipVisible && !minimap}
        setVisible={setTooltipVisible}
    >
        <image
            xlinkHref={industry.image}
            transform={industry.transform}
            width={industry.width}
            height={industry.height}
            className={'clickable highlight'}
        />
        <StorageInfo
            title={industry.name}
            storages={{
                Input: data.Educts,
                Output: data.Products
            }}
            isVisible={infoVisible && !minimap}
            onClose={() => {
                setInfoVisible( false );
                setTooltipVisible( false );
            }}
        />
    </MapTooltip>;
} );