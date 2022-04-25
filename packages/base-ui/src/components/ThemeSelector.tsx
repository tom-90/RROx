import { Theme, useLazyStyles } from '@rrox/api';
import React from 'react';
import DarkTheme from '../styles/app.dark.lazy.less';
import LightTheme from '../styles/app.light.lazy.less';

export function ThemeSelector( { children }: { children?: React.ReactNode } ) {
    useLazyStyles( {
        [ Theme.DARK  ]: DarkTheme,
        [ Theme.LIGHT ]: LightTheme,
    } );

    return children as React.ReactElement;
}