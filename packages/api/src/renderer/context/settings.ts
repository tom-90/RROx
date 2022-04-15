import { useContext } from "react";
import { getContext } from "./internal";

export interface SettingsContext {
    get<T = unknown>( key: string ): T;
    set( key: string, val: any ): void;
    reset( key: string ): void;
}

export function useSettings(): SettingsContext {
    return useContext( getContext( "settings" ) );
}