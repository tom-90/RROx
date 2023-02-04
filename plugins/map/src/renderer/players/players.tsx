import { Avatar, Button, List } from 'antd';
import { ControlOutlined, AimOutlined } from '@ant-design/icons';
import React from 'react';
import { IPlayer } from '@rrox-plugins/world/shared';
import PlayerImage from '../images/players/player.png';

export function PlayerList( {
    data,
    //onOpenControls,
    onLocate
}: {
	data: { index: number, player: IPlayer }[],
    //onOpenControls: ( index: number ) => void,
    onLocate: ( index: number ) => void,
} ) {
    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={( { player, index } ) => {
            //const definition = PlayerDefinitions[ frame.type ];
			
			//const PlayerImagePath = PlayerImage;

			//const PlayerDefinitions = { image: PlayerImage };

            let actions = [];
			/*
            if( definition.engine )
                actions.push( <Button
                    title="Open controls in new window"
                    icon={<ControlOutlined />}
                    onClick={() => onOpenControls( index )}
                    size='large'
                /> );
				*/
            actions.push( <Button
                title="Locate on the map"
                icon={<AimOutlined />}
                onClick={() => onLocate( index )}
                size='large'
            /> );

            return <List.Item
                actions={actions}
                className={'player-list-item'}
            >
                <List.Item.Meta
                   // avatar={<Avatar shape='square' className='dark-mode-invert' src={PlayerDefinitions.image} size={100} style={{ marginTop: -25 }} />}
					avatar={<Avatar shape='square' className='dark-mode-invert' src={PlayerImage} size={100} style={{ marginTop: -25 }} />}
                    title={`${player.name.toUpperCase()}`}
                    description={null}
                />
            </List.Item>;
        }}
    />;
}