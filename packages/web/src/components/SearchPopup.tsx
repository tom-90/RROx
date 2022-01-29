import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button } from 'antd';
import { useMapData } from "../helpers/mapData";
import {FrameDefinitions} from "@rrox/components";
import { ControlOutlined, AimOutlined } from '@ant-design/icons';

export function SearchPopup({} : {

}){
    let { serverKey } = useParams();
    const navigate = useNavigate();

    const [ inputValue, setInputValue] = useState('');
    let searchItems : {
        ID: number,
        title: string,
        desc: string
    }[] = [];

    const locate = ( ID: number ) => {
        navigate( `/${serverKey}`, {
            state: {
                locate: {
                    type: 'Frames',
                    id  : ID,
                }
            }
        });
    }

    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, features, actions: actions } = useMapData();
    mapData.Frames.forEach(frame => {
        let title = `${frame.Name.toUpperCase()}${frame.Name && Number ? ' - ' : ''}${frame.Number.toUpperCase() || ''}`;
        if(FrameDefinitions[ frame.Type ].engine){
            searchItems.push({
                ID: frame.ID,
                title: title,
                desc: 'Locomotive - '+frame.Type.toUpperCase()
            });
        }else if(FrameDefinitions[ frame.Type ].tender){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Tender',
                desc: 'Tender - '+frame.Type.toUpperCase()
            });
        }else if(FrameDefinitions[ frame.Type ].freight){
            searchItems.push({
                ID: frame.ID,
                title: title.length != 0 ? title : 'Freight',
                desc: 'Freight - '+frame.Type.toUpperCase()
            });
        }
    });
    mapData.Players.forEach(player => {
        searchItems.push({
            ID: player.ID,
            title: player.Name,
            desc: 'Player'
        });
    });

    return (<div className="search-div">
        <div className="search-button-div">
            <button>Search</button>
        </div>
        <div className="search-popup-div">
            <div className="search-popup">
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
                    }).map(({ID, title, desc}, key) => <div className="search-result" key={'search-item-'+key}>
                        <div className="text">
                            <span className="result-title">{title}</span>
                            <span className="result-desc">{desc}</span>
                        </div>
                        <div className="button">
                            <Button
                                title="Locate on the map"
                                icon={<AimOutlined />}
                                onClick={() => locate( ID )}
                                size='large'
                            />
                        </div>
                    </div>)}
                </div>
                <div className="search-close">
                    x
                </div>
            </div>
        </div>
    </div>);
}