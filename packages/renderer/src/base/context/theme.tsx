import { Theme, ThemeContext as ThemeContextType, useSettings } from "@rrox/api";
import { ThemeSelector } from "@rrox/base-ui";
import React, { useMemo } from "react";
import { BaseRendererSettings } from "../../settings";

export const ThemeContext = React.createContext<ThemeContextType>( {
    theme: Theme.LIGHT
} );

export function ThemeProvider( { children }: { children?: React.ReactNode }) {
    const [ preferences ] = useSettings( BaseRendererSettings );

    const value = useMemo( () => {
        return { theme: preferences.theme };
    }, [ preferences.theme ] )

    return <ThemeContext.Provider value={value}>
        <div className={'theme-' + preferences.theme}>
            <ThemeSelector children={children} />
        </div>
    </ThemeContext.Provider>;
}