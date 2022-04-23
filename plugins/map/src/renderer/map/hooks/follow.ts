import { useEffect, useState } from "react";
import { IWorld } from "@rrox/world/shared";
import { useWorld } from "@rrox/world/renderer";
import { MapMode } from "../types";
import { usePrevious } from "./previous";

export type FollowingData<K extends keyof IWorld = keyof IWorld> = { array: K, index: number, apply: ( data: IWorld[ K ][ number ], map: L.Map ) => void } | null;

/**
 * Hook that handles all logic related to following elements on the map
 *
 * @param map 
 * @param mapMode 
 * @param enabled 
 * @returns 
 */
export function useFollowing( map: L.Map | undefined, mapMode: MapMode, enabled: boolean = true ): [
    FollowingData | undefined,
    ( following?: FollowingData ) => void,
] {
    const data = useWorld();

    const [ following, setFollowing ] = useState<FollowingData | undefined>( undefined );

    useEffect( () => {
        if( !map || !data )
            return;

        const isFollowing = enabled && following?.array != null && following?.index != null && following.apply != null;

        if ( map.dragging.enabled() && isFollowing )
            map.dragging.disable();
        else if ( !map.dragging.enabled() && !isFollowing )
            map.dragging.enable();
        
        if ( map.options.scrollWheelZoom === true && isFollowing )
            map.options.scrollWheelZoom = 'center';
        else if ( map.options.scrollWheelZoom !== true && !isFollowing )
            map.options.scrollWheelZoom = true;

        if( isFollowing ) { 
            let item = data[ following?.array ]?.[ following?.index ];
            if( item )
                following.apply( item, map );
        }
    }, [ enabled, following?.array, following?.index, following?.array ? data?.[ following?.array ]?.[ following?.index ] : null, map ] );

    const prevMode = usePrevious( mapMode );

    useEffect( () => {
        if( !map || !data )
            return;

        const applyFollow = () => {
            if( enabled && following?.array != null && following?.index != null && following.apply != null ) {
                let item = data[ following?.array ]?.[ following?.index ];
                if( item )
                    following.apply( item, map );
            }
        };

        const observer = new ResizeObserver( () => {
            map.invalidateSize();

            applyFollow();
        } );

        observer.observe( map.getContainer() );

        applyFollow();

        if( prevMode === MapMode.MINIMAP && mapMode === MapMode.MAP ) {
            map.zoomIn( 1, { animate: false } );
        } else if( prevMode === MapMode.MAP && mapMode === MapMode.MINIMAP ) {
            map.zoomOut( 1, { animate: false } );
        }

        return () => observer.disconnect();
    }, [ map, mapMode, enabled, following?.array, following?.index, following?.array ? data?.[ following?.array ]?.[ following?.index ] : null ] );

    return [
        following,
        setFollowing
    ];
}