import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, Modal } from 'antd';
import { MapContext } from '../context';
import {FrameDefinitions} from "@rrox/components";
import {AimOutlined, ControlOutlined} from '@ant-design/icons';
import { World } from "@rrox/types";

export function SearchPopup({ visible, setVisible, data: mapData } : {
    visible : boolean,
    setVisible: (visible : boolean) => void,
    data: World
}){
    let { serverKey } = useParams();
    const navigate = useNavigate();
    const { actions } = useContext( MapContext );
    const [ inputValue, setInputValue] = useState('');

    let searchItems : {
        ID: number,
        title: string,
        desc: string,
        type: 'engine' | 'tender' | 'freight' | 'player'
    }[] = [];

    mapData.Frames.forEach(frame => {
        let title = `${frame.Name.toUpperCase()}${frame.Name && Number ? ' - ' : ''}${frame.Number.toUpperCase() || ''}`;
        if(FrameDefinitions[ frame.Type ].engine){
            searchItems.push({
                ID: frame.ID,
                title: title,
                desc: 'Locomotive - '+ FrameDefinitions[ frame.Type ].name,
                type: 'engine'
            });
        }else if(FrameDefinitions[ frame.Type ].tender){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Tender',
                desc: 'Tender - '+ FrameDefinitions[ frame.Type ].name,
                type: 'tender'
            });
        }else if(FrameDefinitions[ frame.Type ].freight){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Freight',
                desc: 'Freight - '+ FrameDefinitions[ frame.Type ].name,
                type: 'freight'
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
        <div className="search-results">
            {searchItems.filter((item) => {
                if (inputValue.length !== 0){
                    return (item.title.toLowerCase().includes(inputValue.toLowerCase()) || item.desc.toLowerCase().includes(inputValue.toLowerCase()));
                }else{
                    return item;
                }
            }).map(({ID, title, desc, type}, key) => <div className="search-result" key={'search-item-'+key}>
                <div className="text">
                    <span className="result-title">{title}</span>
                    <span className="result-desc">{desc}</span>
                </div>
                <div className="buttons">
                    {type == 'engine' && <Button
                        icon={<ControlOutlined />}
                        onClick={() => actions.openControlsExternal( ID )}
                        title="Open controls in new window"
                        size='large'
                        style={{marginRight: '5px'}}
                    />}
                    <Button
                        title="Locate on the map"
                        icon={<AimOutlined />}
                        onClick={() => {
                            setVisible( false );
                            actions.locate( ID, type === 'player' ? 'Players' : 'Frames' );
                        }}
                        size='large'
                    />
                </div>
            </div>)}
        </div>
    </Modal>);
}