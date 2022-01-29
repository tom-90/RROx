import { DataChange, World } from "@rrox/types";
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "./socket";
import { useSettings } from "../helpers/settings";
import { MapActions, MapFeatures } from "@rrox/components";

export const MapDataContext = createContext<{
    data    : World;
    refresh : () => void;
    clear   : () => void;
    loaded  : boolean;
    features: MapFeatures;
    actions : MapActions
}>( null );

export function useMapData() {
    const context = useContext( MapDataContext );

    return context;
}

export function MapDataProvider( { children }: { children?: React.ReactNode } ) {
    const emptyData: World = {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Sandhouses : [],
        Industries : [],
    };

    const [ mapData, setMapData ] = useState( emptyData );
    const [ loaded , setLoaded  ] = useState( false );

    const location = useLocation();
    const navigate = useNavigate();

    const [ features, setFeatures ] = useState<MapFeatures>( {
        build: false,
        cheats: false,
        controlEngines: false,
        controlSwitches: false,
        teleport: false,
    } );

    const socket = useSocket();

    useEffect( () => {
        let data = { ...mapData };

        const onMapUpdate = ( changes: DataChange[] ) => {
            data = { ...data };

            // We sort the indices in reverse order, such that we can safely remove all of them
            changes = changes.sort( ( a, b ) => b.Index - a.Index );

            changes.forEach( ( c ) => {
                let array = data[ c.Array as keyof typeof mapData ];

                if( c.ChangeType === 'ADD' || c.ChangeType === 'UPDATE' )
                    array[ c.Index ] = c.Data! as any;
                else if( c.ChangeType === 'REMOVE' )
                    array.splice( c.Index, 1 );
            } );

            setMapData( data );
        };

        const onFeaturesChanged = ( features: MapFeatures ) => {
            setFeatures( features );
        };

        const onLeave = () => {
            setMapData( emptyData );
            setLoaded( false );
        };

        socket.on( 'map-update'      , onMapUpdate       );
        socket.on( 'enabled-features', onFeaturesChanged );
        socket.on( 'leave'           , onLeave           );

        // Callback function that gets called when the component disappears
        // So this contains all cleanup logic (removing event listeners)
        return () => {
            socket.removeListener( 'map-update'      , onMapUpdate       );
            socket.removeListener( 'enabled-features', onFeaturesChanged );
            socket.removeListener( 'leave'           , onLeave           );
        };
    }, [ socket, mapData ] );

    const refresh = useMemo( () => {
        return () => {
            socket.invoke( 'map-data' ).then( ( data: World ) => {
                setMapData( data );
                setLoaded( true );
            } ).catch( ( e ) => {
                console.log( 'Failed retrieving map data', e );
            } );

            socket.invoke( 'enabled-features' ).then( ( features: MapFeatures ) => {
                setFeatures( features );
            } ).catch( ( e ) => {
                console.log( 'Failed retrieving enabled features', e );
            } );
        };
    }, [ socket ] );

    const clear = useMemo( () => {
        return () => {
            setMapData( emptyData );
            setLoaded( false );
        };
    }, [] );

    const [ settings ] = useSettings();
    const actions = useMemo<MapActions>( () => ( {
        teleport             : ( x, y, z                   ) => socket.send( 'teleport', x, y, z, settings[ 'multiplayer.client.playerName' ] ),
        changeSwitch         : ( id                        ) => socket.send( 'change-switch', id ) ,
        setCheats            : ( name, walkSpeed, flySpeed ) => socket.send( 'set-cheats', name, walkSpeed, flySpeed ),
        setEngineControls    : ( id, type, value           ) => socket.send( 'set-engine-controls', id, type, value ),
        setControlsSynced    : ( id, enabled               ) => socket.send( 'set-sync-controls', id, enabled ),
        setMoneyAndXP        : ( name, money, xp           ) => socket.send( 'set-money-and-xp', name, money, xp ),
        getColor             : ( key                       ) => ( settings as any )[ `colors.${key}` ],
        getSelectedPlayerName: (                           ) => settings[ 'multiplayer.client.playerName' ],
        buildSplines         : ( splines, simulate         ) => socket.invoke( 'build-spline', splines, simulate ),
        openControlsExternal : ( id                        ) => window.open( `${location.pathname.split( '/' )[ 1 ]}/controls/${id}`, '_blank' ),
        openNewTab           : ( url                       ) => window.open( url, '_blank' ),
    } ), [ settings, socket, location ] );

    return <MapDataContext.Provider value={{
        data: mapData,
        refresh,
        clear,
        loaded,
        features,
        actions
    }}>
        {children}
    </MapDataContext.Provider>;
}