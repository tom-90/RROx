import { useContext, useEffect } from "react";
import { Theme } from "../types"
import { getContext } from "./internal";

export type ThemeContext = {
    theme: Theme,
}

/**
 * Use lazily loaded stylesheets to dynamically load styles for the configured theme
 *
 * @param styles 
 * @returns Theme currently in use
 */
export function useLazyStyles( styles: Partial<{ [ K in Theme ]: { use: () => void, unuse: () => void } }> ): Theme {
    const theme = useTheme();

    useEffect( () => {
        let style: { use: () => void, unuse: () => void } | undefined = styles[ theme ];

        if( style ) {
            style.use();
            return () => style!.unuse();
        }
    }, [ theme, styles ] );

    return theme;
}

/**
 * Get the currently active theme
 *
 * @returns Theme currently in use
 */
export function useTheme(): Theme {
    const context = useContext( getContext( "theme" ) );

    return context.theme;
}