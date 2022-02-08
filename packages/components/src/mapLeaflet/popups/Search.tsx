import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Modal, List, Avatar } from 'antd';
import { MapContext } from '../context';
import {FrameDefinitions} from "@rrox/components";
import {AimOutlined, ControlOutlined} from '@ant-design/icons';
import { World } from "@rrox/types";

export function SearchPopup({ visible, setVisible, data: mapData } : {
    visible : boolean,
    setVisible: (visible : boolean) => void,
    data: World
}){
    const { actions } = useContext( MapContext );
    const [ inputValue, setInputValue] = useState('');

    let searchItems : {
        ID: number,
        title: string,
        desc: string,
        type: 'engine' | 'tender' | 'freight' | 'player',
        image?: string,
    }[] = [];

    mapData.Frames.forEach(frame => {
        let title = `${frame.Name.toUpperCase()}${frame.Name && Number ? ' - ' : ''}${frame.Number.toUpperCase() || ''}`;
        if(FrameDefinitions[ frame.Type ].engine){
            searchItems.push({
                ID   : frame.ID,
                title: title,
                desc : 'Locomotive - '+ FrameDefinitions[ frame.Type ].name,
                type : 'engine',
                image: FrameDefinitions[ frame.Type ].image,
            });
        }else if(FrameDefinitions[ frame.Type ].tender){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Tender',
                desc: 'Tender - '+ FrameDefinitions[ frame.Type ].name,
                type: 'tender',
                image: FrameDefinitions[ frame.Type ].image,
            });
        }else if(FrameDefinitions[ frame.Type ].freight){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Freight',
                desc: 'Freight - '+ FrameDefinitions[ frame.Type ].name,
                type: 'freight',
                image: FrameDefinitions[ frame.Type ].image,
            });
        }
    });
    mapData.Players.forEach(player => {
        searchItems.push({
            ID: player.ID,
            title: player.Name,
            desc: 'Player',
            type: 'player'
        });
    });

    return (<Modal className="search-popup"
        visible={visible}
        footer={null}
        onCancel={ () => setVisible(false)}
    >
        <Input
            placeholder="Search...."
            onChange={(e) => setInputValue(e.target.value) }
        />
        <List
            itemLayout="horizontal"
            dataSource={searchItems.filter( ( item ) => {
                if ( inputValue.length !== 0 ) {
                    return ( item.title.toLowerCase().includes( inputValue.toLowerCase() ) || item.desc.toLowerCase().includes( inputValue.toLowerCase() ) );
                } else {
                    return item;
                }
            } )}
            style={{
                maxHeight: '60vh',
                overflowY: 'scroll'
            }}
            renderItem={( item ) => {
                let buttons: JSX.Element[] = [];
                if( item.type === 'engine' )
                buttons.push( <Button
                        title="Open controls in new window"
                        icon={<ControlOutlined />}
                        onClick={() => {
                            setVisible( false );
                            actions.openControlsExternal( item.ID );
                        }}
                        size='large'
                    /> );
                buttons.push( <Button
                    title="Locate on the map"
                    icon={<AimOutlined />}
                    onClick={() => {
                        setVisible( false );
                        actions.locate( item.ID, item.type === 'player' ? 'Players' : 'Frames' );
                    }}
                    size='large'
                /> );

                return (
                    <List.Item actions={buttons}>
                        <List.Item.Meta
                            avatar={<Avatar shape='square' src={item.image} size={100} style={{ marginTop: -35, opacity: item.image != null ? 1 : 0 }} />}
                            title={item.title}
                            description={item.desc}
                        />
                    </List.Item>
                );
            }}
        />
    </Modal>);
}