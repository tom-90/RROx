import React, { useState } from 'react';
import { PageLayout } from "@rrox/base-ui";
import L from 'leaflet';
import { MapContext } from './context';
import './styles.less';
import { Modal } from './modal';
import { useFollowing, useLocate } from './hooks';
import { MapMode } from './types';
import { Map } from './map';
import { useWorld } from '@rrox/world/renderer';
import { MapConfig } from './config';
import { OverlayMode, useOverlayMode, useSettings } from '@rrox/api';
import { MapPreferences } from '../../shared';
import { WorldSettings } from '@rrox/world/shared';

export function MapOverlay() {
    const data = useWorld();
    const overlayMode = useOverlayMode();
    const [ settings ] = useSettings( WorldSettings );
    const [ preferences ] = useSettings( MapPreferences );

    const mode = overlayMode === OverlayMode.FOCUSSED ? MapMode.MAP : MapMode.MINIMAP;
    const [ map, setMap ] = useState<L.Map>();
    const [ following, setFollowing ] = useFollowing( map, mode, mode !== MapMode.MAP );
    useLocate( map );

    if( !preferences['minimap.enabled'] )
        return null;

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
            currentPlayerName: '_tom()',
            utils: MapConfig.utils
        }}
    >
        <Modal>
            <div className={[ 'map', `map-${mode}`, `corner-${preferences[ 'minimap.corner' ]}` ].join( ' ' )}>
                {data ? <Map
                    data={data}
                    setMap={setMap}
                /> : null}
            </div>
        </Modal>
    </MapContext.Provider>;
}