import { useWorld } from "@rrox-plugins/world/renderer";
import { IWorld } from "@rrox-plugins/world/shared";
import L from "leaflet";
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { MapConfig } from "../config";

/**
 * Hook that handles all logic related to locating elements on the map
 */
export function useLocate( map?: L.Map ) {
    const location = useLocation();
    const navigate = useNavigate();
    const data = useWorld();

    useEffect( () => {
        if( !location.state?.locate || !data || !map )
            return;
        
        const { type, index } = location.state.locate as { type: keyof IWorld, index: number };
        const item = data[ type ]?.[ index ];

        if( !item || !item.location )
            return;

        map.setView( L.latLng( ...MapConfig.utils.scaleLocation( item.location ) ), 14, { animate: false } );

        navigate( location.pathname );
    }, [ location.state, data, map ] );
}