import { Frame } from '@rrox/types';
import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined } from '@ant-design/icons';
import React from 'react';
import { FrameDefinitions } from '../../mapLeaflet/definitions/Frame';
import './style.less';

export function FramesList( {
    data,
    onOpenControls,
    onLocate
}: {
    data: Frame[],
    onOpenControls: ( ID: number ) => void,
    onLocate: ( ID: number ) => void,
} ) {
    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={( frame ) => {
            const { ID, Name, Number, BoilerPressure, FuelAmount, FireTemperature, WaterTemperature } = frame;

            const definition = FrameDefinitions[ frame.Type ];

            let actions = [];
            if( definition.engine )
                actions.push( <Button
                    title="Open controls in new window"
                    icon={<ControlOutlined />}
                    onClick={() => onOpenControls( ID )}
                    size='large'
                /> );
            actions.push( <Button
                title="Locate on the map"
                icon={<AimOutlined />}
                onClick={() => onLocate( ID )}
                size='large'
            /> );

            return <List.Item
                actions={actions}
                className={'frame-list-item'}
            >
                <List.Item.Meta
                    avatar={<Avatar shape='square' src={definition.image} size={100} style={{ marginTop: -25 }} />}
                    title={`${Name.toUpperCase()}${Name && Number ? ' - ' : ''}${Number.toUpperCase() || ''}`}
                    description={definition.engine ? <table>
                            <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Boiler Pressure</th>
                                <th style={{ width: '30%' }}>Fuel Amount</th>
                                <th style={{ width: '20%' }}>Fire Temp.</th>
                                <th style={{ width: '20%' }}>Water Temp.</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{ textAlign: 'center', color: BoilerPressure < 80 ? "red" : "black" }}>{BoilerPressure.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: FuelAmount < 10 ? "red" : "black" }}>{FuelAmount.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: FireTemperature < 100 ? "red" : "black" }}>{FireTemperature.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: WaterTemperature < 100 ? "red" : "black" }}>{WaterTemperature.toFixed(0)}</td>
                            </tr>
                            </tbody>
                        </table> : null
                    }
                />
            </List.Item>;
        }}
    />;
}