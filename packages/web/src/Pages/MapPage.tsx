import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {World} from "@rrox/types";
import {Map, MapActions, MapMode, MapSettings} from "@rrox/components";

export function MapPage() {

    const [ mapData, setMapData ] = useState<World>( {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Sandhouses : [],
        Industries : [],
    } );

    const getSettings = () => ( {
        background: 1,
        minimapCorner: 0,
        transparent: false,
    } );

    const [ settings, setSettings ] = useState<MapSettings>( useMemo( getSettings, [] ) );
    const [ controlEnabled, setControlEnabled ] = useState( false );

    useEffect( () => {
        let data = { ...mapData };



    }, [] );

    const actions = useMemo<MapActions>( () => ( {
        teleport         : ( x, y, z ) => {

        },
        changeSwitch     : ( id ) => {

        },
        setEngineControls: ( id, type, value ) => {

        },
        getColor         : ( key ) => '#000',
    } ), [ settings ] );

    return (
        <Map
            data={mapData}
            settings={settings}
            actions={actions}
            mode={MapMode.NORMAL}
            controlEnabled={controlEnabled}
        />
    );
}