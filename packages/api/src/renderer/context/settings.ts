import { useContext, useEffect, useMemo, useState } from "react";
import { SettingsStore, SettingsType } from "../../shared";
import { getContext } from "./internal";

export interface SettingsContext {
    get<T extends object>( settings: SettingsType<T> ): SettingsStore<T>;
}

/**
 * Hook to retrieve the value and settings store for a declared settings type
 * 
 * @param settings Settings type to use
 * @returns Array containing the settings object value and the settings store
 */
export function useSettings<T extends object>( settings: SettingsType<T> ): [
    settings: T,
    store: SettingsStore<T>
] {
    const context = useContext( getContext( "settings" ) );

    const store = useMemo( () => {
        return context.get( settings );
    }, [ settings, context ] );

    const [ data, setData ] = useState( () => store.getAll() );

    useEffect( () => {
        const listener = () => setData( store.getAll() );

        store.addListener( 'update', listener );

        return () => store.removeListener( 'update', listener );
    }, [ store ] );

    return [ data, store ];
}