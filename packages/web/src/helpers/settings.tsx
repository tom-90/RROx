import { Cars, SplineType } from "@rrox/types";
import React, { createContext, useState, useContext, useMemo } from "react";

export interface Settings {
    'multiplayer.client.playerName'?: string;
    'map.background': number;
    'site.darkMode': boolean;
}

export const defaultSettings = {
    'map.background': 6,
    'site.darkMode': false,

    [ `colors.${Cars.HANDCAR}`         ]: '#800080',
    [ `colors.${Cars.PORTER}`          ]: '#800080',
    [ `colors.${Cars.PORTER2}`         ]: '#800080',
    [ `colors.${Cars.EUREKA}`          ]: '#800080',
    [ `colors.${Cars.EUREKA_TENDER}`   ]: '#000000',
    [ `colors.${Cars.CLIMAX}`          ]: '#800080',
    [ `colors.${Cars.HEISLER}`         ]: '#800080',
    [ `colors.${Cars.CLASS70}`         ]: '#800080',
    [ `colors.${Cars.CLASS70_TENDER}`  ]: '#000000',
    [ `colors.${Cars.COOKE260}`        ]: '#800080',
    [ `colors.${Cars.COOKE260_TENDER}` ]: '#000000',

    [ `colors.${Cars.FLATCAR_LOGS}.unloaded`     ]: '#cd5c5c',
    [ `colors.${Cars.FLATCAR_LOGS}.loaded`       ]: '#cd5c5c',
    [ `colors.${Cars.FLATCAR_CORDWOOD}.unloaded` ]: '#ffa500',
    [ `colors.${Cars.FLATCAR_CORDWOOD}.loaded`   ]: '#ffa500',
    [ `colors.${Cars.FLATCAR_STAKES}.unloaded`   ]: '#adff2f',
    [ `colors.${Cars.FLATCAR_STAKES}.loaded`     ]: '#adff2f',
    [ `colors.${Cars.HOPPER}.unloaded`           ]: '#bc8f8f',
    [ `colors.${Cars.HOPPER}.loaded`             ]: '#bc8f8f',
    [ `colors.${Cars.TANKER}.unloaded`           ]: '#d3d3d3',
    [ `colors.${Cars.TANKER}.loaded`             ]: '#d3d3d3',
    [ `colors.${Cars.BOXCAR}.unloaded`           ]: '#808080',
    [ `colors.${Cars.BOXCAR}.loaded`             ]: '#808080',

    [ `colors.${Cars.CABOOSE}` ]: '#ff5e5e',
    
    [ `colors.spline.${SplineType.TRACK}`         ]: '#000000',
    [ `colors.spline.${SplineType.TRENDLE_TRACK}` ]: '#000000',
    [ `colors.spline.${SplineType.VARIABLE_BANK}` ]: '#bdb76b',
    [ `colors.spline.${SplineType.CONSTANT_BANK}` ]: '#bdb76b',
    [ `colors.spline.${SplineType.VARIABLE_WALL}` ]: '#a9a9a9',
    [ `colors.spline.${SplineType.CONSTANT_WALL}` ]: '#a9a9a9',
    [ `colors.spline.${SplineType.WOODEN_BRIDGE}` ]: '#ffa500',
    [ `colors.spline.${SplineType.IRON_BRIDGE}`   ]: '#add8e6',

    [ `colors.switch.active`   ]: '#000000',
    [ `colors.switch.inactive` ]: '#ff0000',
    [ `colors.switch.cross`    ]: '#000000',
    
    [ `colors.turntable.circle` ]: '#ffffe0',
    
    [ `colors.player` ]: '#0000ff',
}

export const SettingsContext = createContext<{
    settings: Settings;
    setSettings: ( settings: Partial<Settings> ) => Settings;
}>( {
    settings   : defaultSettings,
    setSettings: () => null,
} );

export function useSettings(): [ settings: Settings, setSettings: ( settings: Partial<Settings> ) => void ] {
    const context = useContext( SettingsContext );

    return [ context.settings, context.setSettings ];
}

export function SettingsProvider( { children }: { children?: React.ReactNode } ) {

    const initialSettings = useMemo<Settings>( () => ( {
        ...defaultSettings,
        ...JSON.parse( localStorage.getItem( 'settings' ) ),
    } ), [] );

    const [ settings, setSettingsState ] = useState( initialSettings );

    const setSettings = useMemo( () => {
        return ( newSettings: Settings ) => {
            newSettings = {
                ...defaultSettings,
                ...settings,
                ...newSettings
            };

            setSettingsState( newSettings );

            localStorage.setItem( 'settings', JSON.stringify( newSettings ) );

            return newSettings;
        };
    }, [ settings ] );

    return <SettingsContext.Provider value={{
        settings,
        setSettings
    }}>
        {children}
    </SettingsContext.Provider>;
}