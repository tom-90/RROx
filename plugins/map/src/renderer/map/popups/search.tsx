import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Modal, List, Avatar } from 'antd';
import { MapContext } from '../context';
import { AimOutlined, ControlOutlined } from '@ant-design/icons';
import { FrameCarType, IWorld } from "@rrox-plugins/world/shared";
import { FrameDefinitions } from "../definitions";
import PlayerImage from '../../images/players/player.png';

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
        let title = `${frame.name.toUpperCase()}${frame.name && frame.number ? ' - ' : ''}${frame.number.toUpperCase() || ''}`;

        const definition = FrameDefinitions[ frame.type ] ?? FrameDefinitions[ FrameCarType.UNKNOWN ];

        if ( definition.engine ) {
            searchItems.push( {
                index: i,
                title: title,
                desc: 'Locomotive - ' + definition.name,
                type: 'engine',
                image: definition.image,
            } );
        } else if ( definition.tender ) {
            searchItems.push( {
                index: i,
                title: title.length != 0 ? title : 'Tender',
                desc: 'Tender - ' + definition.name,
                type: 'tender',
                image: definition.image,
            } );
        } else if ( definition.freight ) {
            searchItems.push( {
                index: i,
                title: title.length != 0 ? title : 'Freight',
                desc: 'Freight - ' + definition.name,
                type: 'freight',
                image: definition.image,
            } );
        }
    } );

    data.players.forEach( ( player, i ) => {
        searchItems.push( {
            index: i,
            title: player.name,
            desc: 'Player',
            type: 'player',
            image: PlayerImage,
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
                                    type: item.type === 'player' ? 'players' : 'frameCars',
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
                            avatar={<Avatar shape='square' src={item.image} size={100} style={{ marginTop: -25, opacity: item.image != null ? 1 : 0 }} />}
                            title={item.title}
                            description={item.desc}
                        />
                    </List.Item>
                );
            }}
        />
    </Modal> );
}