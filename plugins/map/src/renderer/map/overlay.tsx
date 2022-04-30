import React, { useState } from 'react';
import L from 'leaflet';
import { MapContext } from './context';
import { Modal } from './modal';
import { useFollowing, useLocate, useMapSettings, useMapStyle, usePlayerName } from './hooks';
import { MapMode } from './types';
import { Map } from './map';
import { useWorld } from '@rrox-plugins/world/renderer';
import { MapConfig } from './config';
import { OverlayMode, useOverlayMode, useSettings } from '@rrox/api';
import { MapPreferences } from '../../shared';

export function MapOverlay() {
    const data = useWorld();
    const overlayMode = useOverlayMode();
    const settings = useMapSettings();
    const [ preferences ] = useSettings( MapPreferences );

    const mode = overlayMode === OverlayMode.FOCUSSED ? MapMode.MAP : MapMode.MINIMAP;
    const [ map, setMap ] = useState<L.Map>();
    const [ following, setFollowing ] = useFollowing( map, mode, mode !== MapMode.MAP );
    useLocate( map );

    useMapStyle();

    const currentPlayerName = usePlayerName( data );

    return <MapContext.Provider
        value={{
            follow: {
                following,
                setFollowing
            },
            settings,
            preferences,
            mode,
            config: {
                game: MapConfig.game,
                map: MapConfig.map,
            },
            currentPlayerName,
            utils: MapConfig.utils
        }}
    >
        <Modal minimapEnabled={preferences.minimap.enabled}>
            <div className={[ 'map', `map-${mode}`, `corner-${preferences.minimap.corner}` ].join( ' ' )}>
                {data ? <Map
                    data={data}
                    setMap={setMap}
                /> : null}
            </div>
        </Modal>
    </MapContext.Provider>;
}