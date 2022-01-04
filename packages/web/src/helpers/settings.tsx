import React, { createContext, useState, useContext, useMemo } from "react";

export interface Settings {
    selectedPlayer?: string;
    background: number;
}

export const defaultSettings = {
    background: 6,
}

export const SettingsContext = createContext<{
    settings: Settings;
    setSettings: ( settings: Partial<Settings> ) => void;
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
        };
    }, [ settings ] );

    return <SettingsContext.Provider value={{
        settings,
        setSettings
    }}>
        {children}
    </SettingsContext.Provider>;
}