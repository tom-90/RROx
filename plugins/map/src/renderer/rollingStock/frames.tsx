import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined } from '@ant-design/icons';
import React from 'react';
import { FrameDefinitions } from '../map/definitions';
import { IFrameCar } from '@rrox/world/shared';

export function FramesList( {
    data,
    onOpenControls,
    onLocate
}: {
    data: { index: number, frame: IFrameCar }[],
    onOpenControls: ( index: number ) => void,
    onLocate: ( index: number ) => void,
} ) {
    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={( { frame, index } ) => {
            const definition = FrameDefinitions[ frame.type ];

            let actions = [];
            if( definition.engine )
                actions.push( <Button
                    title="Open controls in new window"
                    icon={<ControlOutlined />}
                    onClick={() => onOpenControls( index )}
                    size='large'
                /> );
            actions.push( <Button
                title="Locate on the map"
                icon={<AimOutlined />}
                onClick={() => onLocate( index )}
                size='large'
            /> );

            return <List.Item
                actions={actions}
                className={'frame-list-item'}
            >
                <List.Item.Meta
                    avatar={<Avatar shape='square' src={definition.image} size={100} style={{ marginTop: -25 }} />}
                    title={`${frame.name.toUpperCase()}${frame.name && frame.number ? ' - ' : ''}${frame.number.toUpperCase() || ''}`}
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
                                <td style={{ textAlign: 'center', color: frame.boiler!.pressure < 80 ? "red" : "black" }} className={frame.boiler!.pressure < 80 ? "dnt" : ""}>{frame.boiler!.pressure.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: frame.boiler!.fuel < 10 ? "red" : "black" }} className={frame.boiler!.fuel < 10 ? "dnt" : ""}>{frame.boiler!.fuel.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: frame.boiler!.fireTemperature < 100 ? "red" : "black" }} className={frame.boiler!.fireTemperature < 100 ? "dnt" : ""}>{frame.boiler!.fireTemperature.toFixed(0)}</td>
                                <td style={{ textAlign: 'center', color: frame.boiler!.waterTemperature < 100 ? "red" : "black" }} className={frame.boiler!.waterTemperature < 100 ? "dnt" : ""}>{frame.boiler!.waterTemperature.toFixed(0)}</td>
                            </tr>
                            </tbody>
                        </table> : null
                    }
                />
            </List.Item>;
        }}
    />;
}