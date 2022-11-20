import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Modal, List, Avatar } from 'antd';
import { MapContext } from '../context';
import { AimOutlined, ControlOutlined } from '@ant-design/icons';
import { IWorld } from "@rrox-plugins/world/shared";
import { FrameDefinitions } from "../definitions";

export function SearchPopup( { visible, setVisible, data }: {
    visible: boolean,
    setVisible: ( visible: boolean ) => void,
    data: IWorld
} ) {
    const navigate = useNavigate();
    const [ inputValue, setInputValue ] = useState( '' );

    let searchItems: {
        index: number,
        title: string,
        desc: string,
        type: 'engine' | 'tender' | 'freight' | 'player',
        image?: string | null,
    }[] = [];

    data.frameCars.forEach( ( frame, i ) => {
        let title = `${frame.name.toUpperCase()}${frame.name && Number ? ' - ' : ''}${frame.number.toUpperCase() || ''}`;
        if ( FrameDefinitions[ frame.type ].engine ) {
            searchItems.push( {
                index: i,
                title: title,
                desc: 'Locomotive - ' + FrameDefinitions[ frame.type ].name,
                type: 'engine',
                image: FrameDefinitions[ frame.type ].image,
            } );
        } else if ( FrameDefinitions[ frame.type ].tender ) {
            searchItems.push( {
                index: i,
                title: title.length != 0 ? title : 'Tender',
                desc: 'Tender - ' + FrameDefinitions[ frame.type ].name,
                type: 'tender',
                image: FrameDefinitions[ frame.type ].image,
            } );
        } else if ( FrameDefinitions[ frame.type ].freight ) {
            searchItems.push( {
                index: i,
                title: title.length != 0 ? title : 'Freight',
                desc: 'Freight - ' + FrameDefinitions[ frame.type ].name,
                type: 'freight',
                image: FrameDefinitions[ frame.type ].image,
            } );
        }
    } );
    
    data.players.forEach( ( player, i ) => {
        searchItems.push( {
            index: i,
            title: player.name,
            desc: 'Player',
            type: 'player'
        } );
    } );

    return ( <Modal className="search-popup"
        visible={visible}
        footer={null}
        onCancel={() => setVisible( false )}
    >
        <Input
            placeholder="Search...."
            onChange={( e ) => setInputValue( e.target.value )}
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
                if ( item.type === 'engine' )
                    buttons.push( <Button
                        title="Open controls in new window"
                        icon={<ControlOutlined />}
                        onClick={() => {
                            setVisible( false );
                            navigate( `/@rrox-plugins/map/controls/${item.index}` );
                        }}
                        size='large'
                    /> );
                buttons.push( <Button
                    title="Locate on the map"
                    icon={<AimOutlined />}
                    onClick={() => {
                        setVisible( false );
                        navigate( '/@rrox-plugins/map/map', {
                            state: {
                                locate: {
                                    type : item.type === 'player' ? 'players' : 'frameCars' ,
                                    index: item.index,
                                }
                            }
                        } );
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
    </Modal> );
}