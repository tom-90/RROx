import * as React from "react";
import {useEffect, useMemo, useState, useRef} from "react";
import AppIcon from '@rrox/assets/images/appicon.ico';
import { Row, Col, Input, Button, message } from "antd";

export function PlayerSelect() {
    let SelectedPlayer = localStorage.getItem('selected-player');



    return (
        <div className="page-container key-input-body">
            <div className="key-input-div">
                <div className="key-input-container">
                    TODO
                </div>
            </div>
            <img src={AppIcon} alt="App Icon" className="app-logo"/>
        </div>
    );
}