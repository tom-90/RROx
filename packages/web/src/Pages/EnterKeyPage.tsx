import * as React from "react";
import {useEffect, useMemo, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { Input, Button, message } from "antd";
import { useSocket } from "../helpers/socket";

export function EnterKey() {
    const [getKeyInput, setKeyInput] = useState('');
    const navigate = useNavigate();

    const UpdateKeyValue = (e : any) => {
        let value = e.target.value;
        setKeyInput(value);
    };

    const OpenMapPage = () => {
        if (getKeyInput){
            navigate( `/${getKeyInput}` );
        }else{
            message.error('Key can not be empty');
        }
    };

    return (
        <div className="page-container key-input-body">
            <div className="key-input-div">
                <div className="key-input-container">
                    <h1>Please enter a key below</h1>
                    <Input type="text" onChange={UpdateKeyValue} required={true}/>
                    <Button type="primary" block={true} onClick={OpenMapPage}>Open Map</Button>
                </div>
            </div>
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}