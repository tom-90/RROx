import React, { useState } from 'react';
import { PageLayout } from "@rrox/base-ui/renderer";
import L from 'leaflet';
import { MapContext } from './context';
import './styles.less';
import { Modal } from './modal';
import { useFollowing, useLocate } from './hooks';
import { MapMode } from './types';
import { Map } from './map';
import { useWorld } from '@rrox/world/renderer';
import { MapConfig } from './config';
import { useSettings } from '@rrox/api';
import { MapSettings } from '../../shared';

export function MapPage() {
    const data = useWorld();
    const [ settings ] = useSettings( MapSettings );

    const mode = MapMode.NORMAL;
    const [ map, setMap ] = useState<L.Map>();
    // @ts-expect-error
    const [ following, setFollowing ] = useFollowing( map, mode, mode !== MapMode.MAP );
    useLocate( map );

    return <PageLayout>
        <MapContext.Provider
            value={{
                follow: {
                    following,
                    setFollowing
                },
                settings,
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
                <div className={[ 'map', `map-${mode}`, `corner-${settings[ 'minimap.corner' ]}` ].join( ' ' )}>
                    {data ? <Map
                        data={data}
                        setMap={setMap}
                    /> : null}
                </div>
            </Modal>
        </MapContext.Provider>
    </PageLayout>;
}