import * as React from "react";
import { useParams } from "react-router-dom";
import { useSocketSession } from "../helpers/socket";
import { useMapData } from "../helpers/mapData";
import { useSettings } from "../helpers/settings";
import { MapPageLayout } from "../components/MapPageLayout";
import { LayoutControl } from '@rrox/components/src/components/layoutControl/LayoutControl';

export function LayoutControlPage() {
    let { serverKey } = useParams();

    const socket = useSocketSession( serverKey );
    const { data: mapData, refresh: refreshMapData, loaded: mapDataLoaded, controlEnabled, actions: actions } = useMapData();
    const [ settings ] = useSettings();

    return (
        <MapPageLayout>
            <LayoutControl />
        </MapPageLayout>
    );
}