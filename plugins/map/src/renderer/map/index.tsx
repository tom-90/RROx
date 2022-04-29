import React, { useState } from 'react';
import { PageLayout } from "@rrox/base-ui";
import L from 'leaflet';
import { MapContext } from './context';
import { Modal } from './modal';
import { useFollowing, useLocate, useMapStyle } from './hooks';
import { MapMode } from './types';
import { Map } from './map';
import { useWorld } from '@rrox-plugins/world/renderer';
import { MapConfig } from './config';
import { useSettings } from '@rrox/api';
import { MapPreferences } from '../../shared';
import { WorldSettings } from '@rrox-plugins/world/shared';

export function MapPage() {
    const data = useWorld();
    const [ settings ] = useSettings( WorldSettings );
    const [ preferences ] = useSettings( MapPreferences );

    const mode = MapMode.NORMAL;
    const [ map, setMap ] = useState<L.Map>();
    const [ following, setFollowing ] = useFollowing( map, mode, true );
    useLocate( map );

    useMapStyle();

    return <PageLayout>
        <MapContext.Provider
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
                <div className={[ 'map', `map-${mode}`, `corner-${preferences.minimap.corner}` ].join( ' ' )}>
                    {data ? <Map
                        data={data}
                        setMap={setMap}
                    /> : null}
                </div>
            </Modal>
        </MapContext.Provider>
    </PageLayout>;
}

export * from './overlay';