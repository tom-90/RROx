import { SettingsContext as SettingsContextType } from "@rrox/api";
import React from "react";

export const SettingsContext = React.createContext<SettingsContextType>( {
    get: () => { throw new Error( 'Settings unavailable.' ) },
} );