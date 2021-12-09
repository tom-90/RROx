import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/PageLayout";
import svgPanZoom from 'svg-pan-zoom';
import { Map } from "../components/map";
import { MapData } from "../components/map/interfaces";
import { DataChange } from "../../shared/data";

export function MapPage() {

    const [ mapData, setMapData ] = useState<MapData>( {
        Frames     : [],
        Splines    : [],
        Switches   : [],
        Turntables : [],
        Players    : [],
        WaterTowers: [],
        Industries : [],
    } );

    useEffect( () => {
        let data = { ...mapData };
        window.ipc.invoke( 'map-data' ).then( ( newData ) => {
            data = newData;
            setMapData( newData );
        } );

        const onUpdate = ( event: Electron.IpcRendererEvent, changes: DataChange[] ) => {
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

        let cleanup = window.ipc.on( 'map-update', onUpdate );

        return () => {
            cleanup();
        }
    }, [] );

    return (
        <PageLayout>
            <Map data={mapData} />
        </PageLayout>
    );
}